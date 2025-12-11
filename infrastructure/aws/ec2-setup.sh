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
    sudo dnf install -y git docker java-21-amazon-corretto maven
elif command -v apt-get &> /dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y git docker.io openjdk-21-jdk maven
fi

# Start Docker
echo "🐳 Starting Docker..."
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

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
DB_NAME=tradewise
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
