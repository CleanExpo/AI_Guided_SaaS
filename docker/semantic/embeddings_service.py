"""
Embeddings Service for Semantic Search
Provides fast, cached embeddings generation using SentenceTransformers
"""

import os
import hashlib
import json
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import torch

# Configuration
MODEL_NAME = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
BATCH_SIZE = int(os.getenv("BATCH_SIZE", "32"))
MAX_LENGTH = int(os.getenv("MAX_LENGTH", "512"))
CACHE_DIR = "/app/cache"

# Initialize FastAPI app
app = FastAPI(title="Embeddings Service", version="1.0.0")

# Global model instance
model: Optional[SentenceTransformer] = None

class EmbeddingRequest(BaseModel):
    texts: List[str]
    cache_key: Optional[str] = None

class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    model: str
    dimensions: int
    cached: bool = False

class HealthResponse(BaseModel):
    status: str
    model: str
    device: str
    cache_size: int

def get_cache_key(texts: List[str]) -> str:
    """Generate a cache key for the given texts"""
    content = json.dumps(sorted(texts), ensure_ascii=True)
    return hashlib.sha256(content.encode()).hexdigest()

def load_from_cache(cache_key: str) -> Optional[List[List[float]]]:
    """Load embeddings from cache if available"""
    cache_file = os.path.join(CACHE_DIR, f"{cache_key}.npy")
    if os.path.exists(cache_file):
        # Check if cache is still valid (24 hours)
        file_time = datetime.fromtimestamp(os.path.getmtime(cache_file))
        if datetime.now() - file_time < timedelta(hours=24):
            return np.load(cache_file).tolist()
    return None

def save_to_cache(cache_key: str, embeddings: np.ndarray):
    """Save embeddings to cache"""
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache_file = os.path.join(CACHE_DIR, f"{cache_key}.npy")
    np.save(cache_file, embeddings)

@app.on_event("startup")
async def startup_event():
    """Initialize the model on startup"""
    global model
    print(f"Loading model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)
    model.max_seq_length = MAX_LENGTH
    
    # Move to GPU if available
    if torch.cuda.is_available():
        model = model.to('cuda')
    
    print(f"Model loaded successfully. Device: {model.device}")

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    cache_files = len([f for f in os.listdir(CACHE_DIR) if f.endswith('.npy')]) if os.path.exists(CACHE_DIR) else 0
    
    return HealthResponse(
        status="healthy",
        model=MODEL_NAME,
        device=str(model.device),
        cache_size=cache_files
    )

@app.post("/embed", response_model=EmbeddingResponse)
async def generate_embeddings(request: EmbeddingRequest):
    """Generate embeddings for the given texts"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if not request.texts:
        raise HTTPException(status_code=400, detail="No texts provided")
    
    # Check cache
    cache_key = request.cache_key or get_cache_key(request.texts)
    cached_embeddings = load_from_cache(cache_key)
    
    if cached_embeddings is not None:
        return EmbeddingResponse(
            embeddings=cached_embeddings,
            model=MODEL_NAME,
            dimensions=len(cached_embeddings[0]),
            cached=True
        )
    
    try:
        # Generate embeddings in batches
        all_embeddings = []
        
        for i in range(0, len(request.texts), BATCH_SIZE):
            batch = request.texts[i:i + BATCH_SIZE]
            batch_embeddings = model.encode(
                batch,
                convert_to_numpy=True,
                show_progress_bar=False,
                normalize_embeddings=True  # L2 normalization for cosine similarity
            )
            all_embeddings.extend(batch_embeddings)
        
        embeddings_array = np.array(all_embeddings)
        
        # Cache the results
        save_to_cache(cache_key, embeddings_array)
        
        return EmbeddingResponse(
            embeddings=embeddings_array.tolist(),
            model=MODEL_NAME,
            dimensions=embeddings_array.shape[1],
            cached=False
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {str(e)}")

@app.post("/embed/batch")
async def generate_batch_embeddings(requests: List[EmbeddingRequest]):
    """Generate embeddings for multiple requests in a single call"""
    results = []
    for request in requests:
        result = await generate_embeddings(request)
        results.append(result)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)