#!/bin/bash
# EC2 Setup Script for TradeWise
# Run this on a fresh Amazon Linux 2023 / Ubuntu EC2 instance

set -e

echo "========================================="
echo "  TradeWise EC2 Setup Script"
echo "========================================="

# Update system
echo "📦 Updating system packages..."
if command -v dnf &> /dev/null; then
    sudo dnf update -y
    # Install Java, Maven, Git, Redis, and PostgreSQL Client
    sudo dnf install -y git java-21-amazon-corretto maven redis6 postgresql15
elif command -v apt-get &> /dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y git openjdk-21-jdk maven redis-server postgresql-client
fi

# Start Redis
echo "🚀 Starting Redis..."
if command -v systemctl &> /dev/null; then
    sudo systemctl enable --now redis6 2>/dev/null || sudo systemctl enable --now redis-server
fi

# Clone repository
echo "📥 Cloning repository..."
if [ ! -d "/home/ec2-user/tradewise" ]; then
    git clone https://github.com/sudheerbez/robinhood.git /home/ec2-user/tradewise
fi
cd /home/ec2-user/tradewise

# Create environment file
echo "⚙️ Creating environment configuration..."
cat > /home/ec2-user/tradewise/.env << 'EOF'
# Database Configuration (Replace with your RDS endpoint)
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_NAME=robinhood
DB_USER=postgres
DB_PASSWORD=your-secure-password

# Redis Configuration (Using local Redis on EC2)
REDIS_HOST=localhost
REDIS_PORT=6379

# Service Ports
AUTH_SERVICE_PORT=8081
PROFILING_SERVICE_PORT=8082
EOF

echo "✅ EC2 setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit /home/ec2-user/tradewise/.env with your RDS credentials"
echo "2. Run: cd /home/ec2-user/tradewise && ./infrastructure/aws/deploy.sh"
