FROM node:20-alpine

# Install Python for agent scripts
RUN apk add --no-cache \
    python3 \
    py3-pip \
    git \
    bash

# Install agent dependencies
RUN pip3 install --no-cache-dir \
    openai \
    anthropic \
    pydantic \
    langchain \
    chromadb \
    tiktoken

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm ci

# Copy agent files
COPY agents/ ./agents/
COPY src/lib/agents/ ./src/lib/agents/

# Create workspace for agent operations
RUN mkdir -p /workspace

# Install ts-node for TypeScript execution
RUN npm install -g ts-node typescript @types/node

# Agent execution command
CMD ["ts-node", "src/lib/agents/engine.ts"]