#!/bin/bash

# SSL Certificate Setup Script
# Supports both Let's Encrypt (recommended) and self-signed certificates

echo "🔒 SSL Certificate Setup for AI Guided SaaS"
echo "=========================================="

# Check if running with appropriate permissions
if [ "$EUID" -ne 0 ] && [ ! -f /.dockerenv ]; then 
    echo "⚠️  This script should be run with sudo or inside a Docker container"
fi

# Function to setup Let's Encrypt
setup_letsencrypt() {
    local domain=$1
    local email=$2
    
    echo "📜 Setting up Let's Encrypt certificates..."
    
    # Install certbot if not present
    if ! command -v certbot &> /dev/null; then
        echo "Installing certbot..."
        if [ -f /etc/debian_version ]; then
            apt-get update && apt-get install -y certbot
        elif [ -f /etc/redhat-release ]; then
            yum install -y certbot
        else
            echo "❌ Unsupported OS. Please install certbot manually."
            return 1
        fi
    fi
    
    # Create web root for ACME challenge
    mkdir -p /var/www/certbot
    
    # Get certificate
    certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$email" \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        -d "$domain" \
        -d "www.$domain"
    
    if [ $? -eq 0 ]; then
        # Copy certificates to nginx directory
        mkdir -p nginx/ssl
        cp /etc/letsencrypt/live/$domain/fullchain.pem nginx/ssl/
        cp /etc/letsencrypt/live/$domain/privkey.pem nginx/ssl/
        cp /etc/letsencrypt/live/$domain/chain.pem nginx/ssl/
        
        echo "✅ Let's Encrypt certificates installed successfully!"
        
        # Setup auto-renewal
        echo "0 0,12 * * * root certbot renew --quiet && cp /etc/letsencrypt/live/$domain/*.pem /app/nginx/ssl/" > /etc/cron.d/certbot-renewal
        echo "✅ Auto-renewal configured"
    else
        echo "❌ Failed to obtain Let's Encrypt certificate"
        return 1
    fi
}

# Function to create self-signed certificate
create_self_signed() {
    local domain=$1
    
    echo "🔐 Creating self-signed certificate..."
    
    mkdir -p nginx/ssl
    
    # Generate private key
    openssl genrsa -out nginx/ssl/privkey.pem 2048
    
    # Generate certificate signing request
    openssl req -new -key nginx/ssl/privkey.pem \
        -out nginx/ssl/cert.csr \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=$domain"
    
    # Generate self-signed certificate
    openssl x509 -req -days 365 \
        -in nginx/ssl/cert.csr \
        -signkey nginx/ssl/privkey.pem \
        -out nginx/ssl/fullchain.pem
    
    # Copy as chain for nginx config compatibility
    cp nginx/ssl/fullchain.pem nginx/ssl/chain.pem
    
    # Clean up
    rm nginx/ssl/cert.csr
    
    echo "✅ Self-signed certificate created!"
    echo "⚠️  Warning: Self-signed certificates will show security warnings in browsers"
}

# Function to setup Cloudflare origin certificate
setup_cloudflare() {
    local domain=$1
    
    echo "☁️  Setting up Cloudflare Origin Certificate..."
    echo ""
    echo "Please follow these steps:"
    echo "1. Log in to your Cloudflare dashboard"
    echo "2. Go to SSL/TLS → Origin Server"
    echo "3. Click 'Create Certificate'"
    echo "4. Add your domain: $domain and *.$domain"
    echo "5. Choose certificate validity (recommended: 15 years)"
    echo "6. Click 'Create'"
    echo ""
    read -p "Press Enter when you have the certificate and key ready..."
    
    mkdir -p nginx/ssl
    
    echo "Paste your Origin Certificate (including BEGIN and END lines):"
    echo "Press Ctrl+D when done:"
    cat > nginx/ssl/fullchain.pem
    
    echo ""
    echo "Paste your Private Key (including BEGIN and END lines):"
    echo "Press Ctrl+D when done:"
    cat > nginx/ssl/privkey.pem
    
    # Cloudflare origin cert doesn't need chain
    touch nginx/ssl/chain.pem
    
    echo "✅ Cloudflare Origin Certificate configured!"
    echo "📌 Remember to set SSL/TLS mode to 'Full (strict)' in Cloudflare"
}

# Main script
echo ""
echo "Choose SSL certificate option:"
echo "1) Let's Encrypt (recommended for public domains)"
echo "2) Self-signed (for development/testing)"
echo "3) Cloudflare Origin Certificate"
echo "4) I'll provide my own certificates"
echo ""
read -p "Enter option (1-4): " option

# Get domain name
read -p "Enter your domain name (e.g., app.example.com): " domain
if [ -z "$domain" ]; then
    echo "❌ Domain name is required"
    exit 1
fi

# Update nginx config with domain
sed -i "s/your-domain.com/$domain/g" nginx/nginx.conf

case $option in
    1)
        read -p "Enter email for Let's Encrypt notifications: " email
        if [ -z "$email" ]; then
            echo "❌ Email is required for Let's Encrypt"
            exit 1
        fi
        setup_letsencrypt "$domain" "$email"
        ;;
    2)
        create_self_signed "$domain"
        ;;
    3)
        setup_cloudflare "$domain"
        ;;
    4)
        echo ""
        echo "📁 Please place your SSL files in nginx/ssl/ directory:"
        echo "  - nginx/ssl/fullchain.pem (certificate + intermediates)"
        echo "  - nginx/ssl/privkey.pem (private key)"
        echo "  - nginx/ssl/chain.pem (intermediate certificates)"
        mkdir -p nginx/ssl
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

# Set proper permissions
chmod 600 nginx/ssl/privkey.pem 2>/dev/null
chmod 644 nginx/ssl/fullchain.pem nginx/ssl/chain.pem 2>/dev/null

# Create Docker SSL setup script
cat > nginx/ssl/docker-ssl-setup.sh << 'EOF'
#!/bin/sh
# This script runs inside the nginx container to ensure proper SSL setup

# Wait for SSL files
while [ ! -f /etc/nginx/ssl/fullchain.pem ] || [ ! -f /etc/nginx/ssl/privkey.pem ]; do
    echo "Waiting for SSL certificates..."
    sleep 5
done

# Test nginx configuration
nginx -t

# Start nginx
exec nginx -g "daemon off;"
EOF

chmod +x nginx/ssl/docker-ssl-setup.sh

echo ""
echo "✅ SSL setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Ensure your domain DNS points to your server IP"
echo "2. Open ports 80 and 443 in your firewall"
echo "3. Start the application with: docker-compose up -d"
echo ""
echo "🔍 To verify SSL after deployment:"
echo "   curl https://$domain/api/health"
echo "   openssl s_client -connect $domain:443 -servername $domain"