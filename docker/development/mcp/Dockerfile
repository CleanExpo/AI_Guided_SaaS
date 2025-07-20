FROM node:20-alpine

# Install required dependencies
RUN apk add --no-cache \
    git \
    bash \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy MCP server files
COPY mcp/ ./mcp/
COPY tsconfig.json ./

# Build TypeScript files
RUN npx tsc

# Create tools directory
RUN mkdir -p /app/tools

# Expose MCP server port
EXPOSE 3001

# Start MCP server
CMD ["node", "dist/mcp/server.js"]