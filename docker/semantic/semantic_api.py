"""
Semantic Search API Gateway
Implements the context7 workflow for token-optimized search
"""

import os
import json
import hashlib
from typing import List, Dict, Any, Optional
from datetime import datetime
import httpx
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from elasticsearch import Elasticsearch, NotFoundError
import redis
import asyncio

# Configuration
EMBEDDINGS_URL = os.getenv("EMBEDDINGS_URL", "http://embeddings:8000")
ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL", "http://vectordb:9200")
INDEX_NAME = os.getenv("INDEX_NAME", "ai-saas-context")
CONTEXT7_SIZE = int(os.getenv("CONTEXT7_SIZE", "7"))
CACHE_TTL = int(os.getenv("CACHE_TTL", "3600"))
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Initialize FastAPI app
app = FastAPI(title="Semantic Search API", version="1.0.0")

# Initialize clients
es = Elasticsearch([ELASTICSEARCH_URL])
try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
except:
    redis_client = None  # Fallback if Redis not available

# Request/Response models
class IndexRequest(BaseModel):
    id: str
    content: str
    metadata: Dict[str, Any] = {}
    type: str = "document"  # document, code, log, config, etc.

class SearchRequest(BaseModel):
    query: str
    filters: Dict[str, Any] = {}
    size: int = CONTEXT7_SIZE
    include_source: bool = True

class SearchResult(BaseModel):
    id: str
    score: float
    content: str
    metadata: Dict[str, Any]
    type: str

class SearchResponse(BaseModel):
    results: List[SearchResult]
    total: int
    query: str
    context7: List[str]  # Top 7 most relevant content chunks

class HealthResponse(BaseModel):
    status: str
    elasticsearch: str
    embeddings_service: str
    redis: str
    index_exists: bool

async def get_embeddings(texts: List[str]) -> List[List[float]]:
    """Get embeddings from the embeddings service"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{EMBEDDINGS_URL}/embed",
            json={"texts": texts},
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()["embeddings"]

def create_index_if_not_exists():
    """Create the Elasticsearch index with proper mappings"""
    if not es.indices.exists(index=INDEX_NAME):
        mappings = {
            "properties": {
                "content": {"type": "text", "analyzer": "standard"},
                "embedding": {
                    "type": "dense_vector",
                    "dims": 384,  # all-MiniLM-L6-v2 dimensions
                    "index": True,
                    "similarity": "cosine"
                },
                "metadata": {"type": "object"},
                "type": {"type": "keyword"},
                "timestamp": {"type": "date"}
            }
        }
        es.indices.create(index=INDEX_NAME, mappings=mappings)

@app.on_event("startup")
async def startup_event():
    """Initialize the index on startup"""
    create_index_if_not_exists()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    # Check Elasticsearch
    es_status = "healthy" if es.ping() else "unhealthy"
    
    # Check embeddings service
    try:
        async with httpx.AsyncClient() as client:
            emb_response = await client.get(f"{EMBEDDINGS_URL}/health", timeout=5.0)
            emb_status = "healthy" if emb_response.status_code == 200 else "unhealthy"
    except:
        emb_status = "unhealthy"
    
    # Check Redis
    redis_status = "healthy"
    if redis_client:
        try:
            redis_client.ping()
        except:
            redis_status = "unhealthy"
    else:
        redis_status = "not configured"
    
    # Check index
    index_exists = es.indices.exists(index=INDEX_NAME)
    
    return HealthResponse(
        status="healthy" if es_status == "healthy" and emb_status == "healthy" else "degraded",
        elasticsearch=es_status,
        embeddings_service=emb_status,
        redis=redis_status,
        index_exists=index_exists
    )

@app.post("/index")
async def index_document(request: IndexRequest):
    """Index a document with semantic embeddings"""
    try:
        # Get embedding for the content
        embeddings = await get_embeddings([request.content])
        embedding = embeddings[0]
        
        # Prepare document
        doc = {
            "content": request.content,
            "embedding": embedding,
            "metadata": request.metadata,
            "type": request.type,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Index in Elasticsearch
        es.index(index=INDEX_NAME, id=request.id, document=doc)
        
        # Invalidate cache for this type
        if redis_client:
            pattern = f"search:*:type:{request.type}:*"
            for key in redis_client.scan_iter(match=pattern):
                redis_client.delete(key)
        
        return {"status": "indexed", "id": request.id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Indexing failed: {str(e)}")

@app.post("/index/batch")
async def index_batch(requests: List[IndexRequest]):
    """Index multiple documents in batch"""
    results = []
    for request in requests:
        try:
            result = await index_document(request)
            results.append(result)
        except Exception as e:
            results.append({"status": "error", "id": request.id, "error": str(e)})
    return {"results": results}

@app.post("/search", response_model=SearchResponse)
async def semantic_search(request: SearchRequest):
    """Perform semantic search with context7 workflow"""
    # Check cache
    cache_key = None
    if redis_client:
        cache_data = f"{request.query}:{json.dumps(request.filters, sort_keys=True)}:{request.size}"
        cache_key = f"search:{hashlib.md5(cache_data.encode()).hexdigest()}"
        cached = redis_client.get(cache_key)
        if cached:
            return SearchResponse(**json.loads(cached))
    
    try:
        # Get embedding for the query
        query_embeddings = await get_embeddings([request.query])
        query_embedding = query_embeddings[0]
        
        # Build query
        knn_query = {
            "field": "embedding",
            "query_vector": query_embedding,
            "k": request.size * 2,  # Get more candidates for filtering
            "num_candidates": request.size * 10
        }
        
        # Add filters if provided
        query_body = {"knn": knn_query}
        if request.filters:
            filter_clauses = []
            for field, value in request.filters.items():
                if field == "type":
                    filter_clauses.append({"term": {"type": value}})
                else:
                    filter_clauses.append({"match": {f"metadata.{field}": value}})
            
            if filter_clauses:
                query_body["query"] = {"bool": {"filter": filter_clauses}}
        
        # Execute search
        response = es.search(
            index=INDEX_NAME,
            body=query_body,
            size=request.size,
            _source=request.include_source
        )
        
        # Process results
        results = []
        context7_content = []
        
        for hit in response["hits"]["hits"]:
            source = hit["_source"]
            result = SearchResult(
                id=hit["_id"],
                score=hit["_score"],
                content=source["content"],
                metadata=source.get("metadata", {}),
                type=source.get("type", "document")
            )
            results.append(result)
            
            # Add to context7 (limited to CONTEXT7_SIZE most relevant)
            if len(context7_content) < CONTEXT7_SIZE:
                context7_content.append(source["content"])
        
        response_data = SearchResponse(
            results=results,
            total=response["hits"]["total"]["value"],
            query=request.query,
            context7=context7_content
        )
        
        # Cache the result
        if redis_client and cache_key:
            redis_client.setex(
                cache_key,
                CACHE_TTL,
                response_data.model_dump_json()
            )
        
        return response_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.delete("/index/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document from the index"""
    try:
        es.delete(index=INDEX_NAME, id=doc_id)
        
        # Clear all caches
        if redis_client:
            for key in redis_client.scan_iter(match="search:*"):
                redis_client.delete(key)
        
        return {"status": "deleted", "id": doc_id}
    except NotFoundError:
        raise HTTPException(status_code=404, detail="Document not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deletion failed: {str(e)}")

@app.post("/reindex")
async def trigger_reindex():
    """Trigger a full reindex of all documents"""
    # This would typically trigger a background job
    # For now, just clear the cache
    if redis_client:
        for key in redis_client.scan_iter(match="search:*"):
            redis_client.delete(key)
    
    return {"status": "reindex triggered"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)