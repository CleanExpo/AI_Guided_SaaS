FROM node:20-alpine

# Install development tools
RUN apk add --no-cache \
    git \
    bash \
    curl \
    wget \
    vim \
    tmux \
    htop \
    docker-cli \
    docker-compose \
    postgresql-client \
    redis \
    jq \
    python3 \
    py3-pip \
    make \
    g++

# Install global Node tools
RUN npm install -g \
    typescript \
    ts-node \
    nodemon \
    prettier \
    eslint \
    jest \
    @swc/cli \
    @swc/core

# Install Python tools
RUN pip3 install --no-cache-dir \
    black \
    pylint \
    pytest \
    httpie \
    ipython

# Install useful CLI tools
RUN npm install -g \
    npm-check-updates \
    depcheck \
    concurrently \
    wait-on \
    cross-env

# Set up workspace
WORKDIR /workspace

# Keep container running
CMD ["tail", "-f", "/dev/null"]