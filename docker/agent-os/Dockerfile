FROM node:20.19.4-alpine AS base

# Install Python and essential tools
RUN apk add --no-cache \
    python3 \
    py3-pip \
    git \
    bash \
    curl \
    jq \
    chromium \
    chromium-chromedriver

# Set up working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy agent scripts
COPY scripts/agents /app/agents
COPY src /app/src
COPY tests /app/tests

# Install Python dependencies for agents
RUN pip3 install --no-cache-dir \
    requests \
    beautifulsoup4 \
    pandas \
    numpy \
    scikit-learn

# Create agent user for security
RUN addgroup -g 1001 -S agent && \
    adduser -S agent -u 1001 -G agent

# Set permissions
RUN chown -R agent:agent /app

# Switch to agent user
USER agent

# Set environment variables
ENV NODE_ENV=production
ENV AGENT_MODE=docker
ENV PLAYWRIGHT_BROWSERS_PATH=/app/browsers

# Install Playwright browsers as agent user
RUN npx playwright install chromium

# Default command
CMD ["node", "agents/orchestrator.js"]