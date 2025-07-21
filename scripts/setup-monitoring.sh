#!/bin/bash

# Monitoring Setup Script for AI Guided SaaS
# Sets up Prometheus, Grafana, and Alertmanager

echo "📊 AI Guided SaaS - Monitoring Setup"
echo "===================================="

# Function to create Grafana datasource config
create_grafana_datasource() {
    cat > docker/monitoring/grafana-datasources.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
    
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    editable: true
EOF
}

# Function to create Loki config
create_loki_config() {
    cat > docker/monitoring/loki-config.yml << EOF
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

ruler:
  alertmanager_url: http://alertmanager:9093

analytics:
  reporting_enabled: false
EOF
}

# Function to create Promtail config
create_promtail_config() {
    cat > docker/monitoring/promtail-config.yml << EOF
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: containers
    static_configs:
      - targets:
          - localhost
        labels:
          job: containerlogs
          __path__: /var/lib/docker/containers/*/*log
    
    pipeline_stages:
      - json:
          expressions:
            output: log
            stream: stream
            attrs:
      - json:
          expressions:
            tag:
          source: attrs
      - regex:
          expression: '(?P<container_name>(?:[^|]*))'
          source: tag
      - timestamp:
          format: RFC3339Nano
          source: time
      - labels:
          stream:
          container_name:
      - output:
          source: output
EOF
}

# Main setup
echo "📁 Creating monitoring configuration files..."

# Create necessary directories
mkdir -p docker/monitoring/alerts
mkdir -p docker/monitoring/grafana-dashboards

# Create configurations
create_grafana_datasource
create_loki_config
create_promtail_config

# Set up alert notification channels
echo ""
echo "🔔 Configuring alert channels..."
echo ""
echo "Please provide the following (press Enter to skip):"
echo ""

read -p "Email for alerts: " alert_email
if [ ! -z "$alert_email" ]; then
    sed -i "s/alerts@your-domain.com/$alert_email/g" docker/monitoring/alertmanager.yml
    sed -i "s/ops-team@your-domain.com/$alert_email/g" docker/monitoring/alertmanager.yml
fi

read -p "Slack webhook URL (optional): " slack_webhook
if [ ! -z "$slack_webhook" ]; then
    sed -i "s|YOUR_SLACK_WEBHOOK_URL|$slack_webhook|g" docker/monitoring/alertmanager.yml
else
    # Comment out Slack configuration if not provided
    sed -i 's/slack_api_url:/#slack_api_url:/g' docker/monitoring/alertmanager.yml
fi

read -p "PagerDuty service key (optional): " pagerduty_key
if [ ! -z "$pagerduty_key" ]; then
    sed -i "s/YOUR_PAGERDUTY_SERVICE_KEY/$pagerduty_key/g" docker/monitoring/alertmanager.yml
fi

# Start monitoring stack
echo ""
echo "🚀 Starting monitoring stack..."
docker-compose -f docker-compose.monitoring.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 20

# Check service health
echo ""
echo "🏥 Checking service health..."
services=("prometheus:9090" "grafana:3001" "alertmanager:9093")

for service in "${services[@]}"; do
    name="${service%%:*}"
    port="${service##*:}"
    
    if curl -f -s "http://localhost:$port" > /dev/null 2>&1; then
        echo "✅ $name is running on port $port"
    else
        echo "❌ $name failed to start on port $port"
    fi
done

# Create initial alerts test
echo ""
echo "🧪 Testing alert configuration..."
curl -X POST http://localhost:9093/api/v1/alerts \
  -H "Content-Type: application/json" \
  -d '[{
    "labels": {
      "alertname": "TestAlert",
      "severity": "info",
      "service": "test"
    },
    "annotations": {
      "summary": "This is a test alert",
      "description": "Monitoring system is working correctly"
    }
  }]'

echo ""
echo "✅ Monitoring setup complete!"
echo ""
echo "📊 Access your monitoring tools:"
echo "   - Prometheus: http://localhost:9090"
echo "   - Grafana: http://localhost:3001 (admin/${GRAFANA_PASSWORD:-admin})"
echo "   - Alertmanager: http://localhost:9093"
echo ""
echo "📈 Grafana dashboards:"
echo "   1. Log in to Grafana"
echo "   2. Go to Dashboards → Import"
echo "   3. The AI SaaS dashboard should be auto-loaded"
echo ""
echo "🔔 Alert testing:"
echo "   A test alert has been sent to verify the configuration"
echo "   Check your configured notification channels"