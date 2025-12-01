# Production Deployment Guide

## Quick Start - Local Docker Deployment

```bash
# Set your Gemini API key
export GEMINI_API_KEY="your_api_key_here"

# Build and start everything
docker-compose up --build
```

Access the app at `http://localhost:5173`

## Deployment Platforms

### 1. Heroku

**Backend only:**
```bash
# Create app
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

**Frontend + Backend:**
Consider using Heroku with buildpacks or switch to a full-stack platform.

### 2. DigitalOcean App Platform

Create `app.yaml`:
```yaml
name: scribeflow
services:
- name: backend
  github:
    branch: main
    repo: your-username/transcription-app
  build_command: "cd server && npm install && npm run build"
  run_command: "cd server && npm start"
  http_port: 3001
  envs:
  - key: NODE_ENV
    value: production
  - key: GEMINI_API_KEY
    value: ${GEMINI_API_KEY}
    
- name: frontend
  github:
    branch: main
    repo: your-username/transcription-app
  build_command: "npm install && npm run build"
  run_command: "npx http-server -p 3000 ./dist"
  http_port: 3000
  envs:
  - key: VITE_BACKEND_URL
    value: https://backend-${APP_DOMAIN}
```

Deploy:
```bash
doctl apps create --spec app.yaml
```

### 3. AWS (ECS + ECR)

**Push to ECR:**
```bash
# Create ECR repository
aws ecr create-repository --repository-name scribeflow-backend

# Build and push
docker build -f server/Dockerfile -t scribeflow-backend .
docker tag scribeflow-backend:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/scribeflow-backend:latest
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/scribeflow-backend:latest
```

**Deploy with Fargate/CloudFormation** (create ECS task definition with the image)

### 4. Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**
```bash
npm install -g vercel
vercel deploy
# Set VITE_BACKEND_URL to your backend URL
```

**Backend on Railway:**
1. Connect GitHub repo
2. Select `server/` as root directory
3. Set environment variables:
   - `NODE_ENV: production`
   - `GEMINI_API_KEY: your_key`
4. Deploy

### 5. Self-Hosted with Docker (Ubuntu/Debian)

**Prerequisites:**
```bash
sudo apt update && sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
```

**Deploy:**
```bash
git clone https://github.com/your-username/Transcription-App.git
cd Transcription-App

# Create .env file
cat > .env << EOF
GEMINI_API_KEY=your_gemini_api_key
EOF

# Create .env.local in server directory
cat > server/.env << EOF
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com
EOF

# Start with docker-compose
docker-compose -f docker-compose.yml up -d

# Check status
docker-compose ps
```

**Nginx reverse proxy (optional):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Environment Configuration

### Minimal Configuration
```
GEMINI_API_KEY=your_api_key
NODE_ENV=production
```

### Recommended Configuration
```
# Core
GEMINI_API_KEY=your_api_key
NODE_ENV=production
PORT=3001

# Security
CORS_ORIGIN=https://yourdomain.com

# Performance
RATE_LIMIT_MAX_REQUESTS=200
RATE_LIMIT_WINDOW_MS=900000
```

### Advanced Configuration
```
# All of the above, plus:
LOG_LEVEL=info
GEMINI_MODEL=gemini-2.5-flash
HEALTH_CHECK_INTERVAL=30000
MAX_PAYLOAD_SIZE=50mb
```

## SSL/TLS Setup

### Using Let's Encrypt with Certbot
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # ... rest of config
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Logging

### Docker Logs
```bash
# Backend logs
docker-compose logs backend

# Live logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs frontend
```

### Health Checks
```bash
# Check backend health
curl http://localhost:3001/health

# Expected response
{"status":"ok","timestamp":"2024-12-01T10:00:00Z","environment":"production"}
```

### Monitoring Tools
- **PM2** (for process management)
- **New Relic** (APM)
- **DataDog** (monitoring)
- **Sentry** (error tracking)
- **LogRocket** (session replay)

## Performance Optimization

### Frontend
- ✅ Static assets cached for 1 year
- ✅ Gzip compression enabled
- ✅ Lazy loading components
- ✅ Minified builds

### Backend
- ✅ Rate limiting enabled
- ✅ Helmet.js security headers
- ✅ Request compression
- ✅ Connection pooling

### Database (if added in future)
- Enable connection pooling
- Index frequently queried fields
- Regular vacuum/maintenance
- Backups every 6-12 hours

## Scaling Strategies

### Horizontal Scaling
```bash
# Run multiple backend instances behind load balancer
docker-compose up -d --scale backend=3
```

### Load Balancing (nginx)
```nginx
upstream backend {
    server backend:3001;
    server backend:3002;
    server backend:3003;
}
```

### Database Connection Pool
Configure in backend .env:
```
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_TIMEOUT=30000
```

## Backup & Recovery

### Docker Volume Backup
```bash
# Backup
docker-compose exec backend sh -c 'tar czf /backup.tar.gz /app/data'
docker cp scribeflow_backend_1:/backup.tar.gz ./backup.tar.gz

# Restore
docker cp backup.tar.gz scribeflow_backend_1:/
docker-compose exec backend sh -c 'tar xzf /backup.tar.gz'
```

### Data Export
```bash
# Export user data
docker-compose exec backend npx ts-node export-users.ts
```

## Troubleshooting

**Container won't start:**
```bash
docker-compose logs backend
docker-compose ps
```

**Out of memory:**
```bash
# Increase memory limit in docker-compose.yml
# Add to service:
# deploy:
#   resources:
#     limits:
#       memory: 2G
```

**High CPU usage:**
- Check rate limiting settings
- Monitor API usage
- Consider caching responses
- Enable load balancing

**Slow transcription:**
- Normal for large files (10-15MB)
- Gemini API processing time varies
- Consider implementing job queue for future enhancement

## Security Hardening

- [ ] Enable HTTPS/TLS
- [ ] Set strong CORS origins
- [ ] Rotate API keys regularly
- [ ] Enable audit logging
- [ ] Use secrets manager (AWS Secrets Manager, HashiCorp Vault)
- [ ] Implement request signing
- [ ] Enable rate limiting
- [ ] Regular security updates

## Rollback Procedure

```bash
# Revert to previous Docker image
docker-compose down
git checkout previous-commit-hash
docker-compose up --build
```

## Post-Deployment Checklist

- [ ] API key is secure and never committed
- [ ] CORS is configured for your domain only
- [ ] Health check passes
- [ ] Frontend loads and connects to backend
- [ ] Test file upload and transcription
- [ ] Monitor error logs for 24 hours
- [ ] Setup alerting and monitoring
- [ ] Document deployment for team
- [ ] Create disaster recovery plan
- [ ] Schedule regular backups

## Support

For deployment issues:
1. Check backend logs: `docker-compose logs backend -f`
2. Verify environment variables: `docker-compose config`
3. Test health endpoint: `curl http://localhost:3001/health`
4. Review CORS settings
5. Check firewall/security group rules
