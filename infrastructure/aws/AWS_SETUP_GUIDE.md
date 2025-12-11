# AWS Free Tier Setup Guide

This guide walks you through setting up TradeWise on AWS Free Tier.

## Prerequisites

- AWS Account (Free Tier eligible)
- AWS CLI installed (`brew install awscli`)
- SSH key pair for EC2

---

## Step 1: Create EC2 Instance

1. Go to **EC2 Dashboard** → **Launch Instance**
2. Configure:
   - **Name**: `tradewise-server`
   - **AMI**: Amazon Linux 2023 (Free tier eligible)
   - **Instance type**: `t2.micro` (Free tier)
   - **Key pair**: Create or select existing
   - **Security Group**: Create new with rules:
     - SSH (22) - Your IP
     - HTTP (80) - Anywhere
     - Custom TCP (8081) - Anywhere
     - Custom TCP (8082) - Anywhere

3. Launch and note the **Public IP**

---

## Step 2: Create RDS PostgreSQL

1. Go to **RDS Dashboard** → **Create database**
2. Configure:
   - **Engine**: PostgreSQL
   - **Templates**: Free tier
   - **DB instance identifier**: `tradewise-db`
   - **Master username**: `postgres`
   - **Master password**: (save this!)
   - **Instance class**: `db.t2.micro` (Free tier)
   - **Storage**: 20 GB gp2
   - **Public access**: Yes (for initial setup)
   - **VPC Security Group**: Create new allowing port 5432

3. Wait for creation and note the **Endpoint**

---

## Step 3: Create S3 Bucket

1. Go to **S3 Dashboard** → **Create bucket**
2. Configure:
   - **Bucket name**: `tradewise-frontend-yourusername`
   - **Region**: Same as EC2
   - **Block Public Access**: Uncheck "Block all public access"
   - **Bucket Versioning**: Disable

3. After creation, go to **Permissions** → **Bucket Policy**:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

4. Go to **Properties** → **Static website hosting** → Enable
   - Index document: `index.html`
   - Error document: `index.html`

---

## Step 4: Create CloudFront Distribution

1. Go to **CloudFront** → **Create distribution**
2. Configure:
   - **Origin domain**: Select your S3 bucket website endpoint
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Default root object**: `index.html`
   - **Price class**: Use only North America and Europe (cheapest)

3. Wait for deployment and note the **Distribution domain name**

---

## Step 5: Deploy Backend

SSH into your EC2 instance:

```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

Run the setup script:

```bash
# Download and run setup
curl -fsSL https://raw.githubusercontent.com/sudheerbez/robinhood/main/infrastructure/aws/ec2-setup.sh | bash

# Edit environment file with your RDS credentials
nano /home/ec2-user/tradewise/.env

# Deploy services
cd /home/ec2-user/tradewise
./infrastructure/aws/deploy.sh
```

---

## Step 6: Deploy Frontend

On your local machine:

```bash
# Set environment variables
export S3_BUCKET="your-bucket-name"
export API_URL="http://your-ec2-public-ip"
export CLOUDFRONT_DISTRIBUTION_ID="your-distribution-id"

# Run deployment
./infrastructure/aws/deploy-frontend.sh
```

---

## Step 7: Configure GitHub Secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key |
| `EC2_HOST` | Your EC2 public IP |
| `EC2_SSH_KEY` | Your EC2 private key (entire .pem content) |
| `S3_BUCKET` | Your S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | Your CloudFront distribution ID |

---

## Verification

1. **Backend Health Check**:
   ```bash
   curl http://your-ec2-ip:8081/actuator/health
   curl http://your-ec2-ip:8082/actuator/health
   ```

2. **Frontend**: Visit your CloudFront URL

3. **Test Login/Register**: Should work with real RDS database!

---

## Cost Summary (Free Tier)

| Service | Monthly Free Tier | Your Usage |
|---------|-------------------|------------|
| EC2 t2.micro | 750 hours | ~720 hours ✅ |
| RDS db.t2.micro | 750 hours | ~720 hours ✅ |
| S3 | 5 GB | ~5 MB ✅ |
| CloudFront | 1 TB transfer | Much less ✅ |

**Total: $0/month** (for 12 months of Free Tier)

---

## Troubleshooting

### Services not starting
```bash
tail -f /var/log/auth-service.log
tail -f /var/log/profiling-service.log
```

### Can't connect to RDS
- Check security group allows port 5432 from EC2
- Verify RDS is publicly accessible (for initial setup)

### Frontend not updating
```bash
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```
