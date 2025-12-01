# Backend Server Setup Guide

## Overview
The ScribeFlow application now uses a secure backend server to handle Gemini API key management. The API key is never exposed to the frontend, ensuring production-ready security.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                │
│              - SPA running on port 5173                 │
│              - No API keys exposed                      │
│              - Calls backend via /api/transcribe        │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Backend (Node.js/Express)           │
│              - REST API on port 3001                    │
│              - Secure API key handling                  │
│              - Rate limiting & CORS                     │
│              - Error handling & logging                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Gemini API (Google)                   │
│              - Audio transcription service             │
└─────────────────────────────────────────────────────────┘
```

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Gemini API key from Google AI Studio

### Installation

1. **Install frontend and backend dependencies:**
   ```bash
   npm run install:all
   ```

2. **Setup environment variables:**
   
   Create `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```

   Create `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```

3. **Add your Gemini API key to `server/.env`:**
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

### Running in Development

**Option 1: Run both concurrently (requires terminal with concurrent support)**
```bash
npm run dev:full
```

**Option 2: Run in separate terminals**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run dev:server
```

The frontend will be available at `http://localhost:5173`
The backend will be available at `http://localhost:3001`

## Production Deployment

### Docker Setup

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Environment variables for production:**
   Create `.env` file with:
   ```
   GEMINI_API_KEY=your_production_gemini_api_key
   ```

   Optional:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://yourdomain.com
   RATE_LIMIT_MAX_REQUESTS=200
   ```

### Production Environment Variables

**Backend (`server/.env`)**
- `PORT` - Backend server port (default: 3001)
- `NODE_ENV` - Set to `production`
- `GEMINI_API_KEY` - Your Gemini API key (REQUIRED)
- `GEMINI_MODEL` - Model name (default: gemini-2.5-flash)
- `CORS_ORIGIN` - Comma-separated allowed origins
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

**Frontend (`VITE_BACKEND_URL`)**
- `VITE_BACKEND_URL` - Backend API URL for production

### API Endpoints

#### POST `/api/transcribe`
Transcribes audio/video content using Gemini AI.

**Request:**
```json
{
  "base64Data": "base64_encoded_audio_data",
  "mimeType": "audio/mp3"
}
```

**Response (Success):**
```json
{
  "success": true,
  "transcription": "The transcribed text content...",
  "timestamp": "2024-12-01T10:00:00Z"
}
```

**Response (Error):**
```json
{
  "error": "Bad request",
  "message": "Specific error message",
  "timestamp": "2024-12-01T10:00:00Z"
}
```

**Supported MIME Types:**
- Audio: `audio/mp3`, `audio/mpeg`, `audio/wav`, `audio/x-m4a`, `audio/ogg`, `audio/webm`
- Video: `video/mp4`, `video/mpeg`, `video/webm`

**Rate Limiting:**
- 100 requests per 15 minutes per IP (configurable)
- Returns 429 status code when exceeded

#### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-01T10:00:00Z",
  "environment": "production"
}
```

### Security Features

1. **API Key Protection**
   - API key stored in backend environment only
   - Never exposed to frontend code
   - Not included in build artifacts

2. **CORS Protection**
   - Configurable allowed origins
   - Prevents cross-origin attacks

3. **Helmet.js**
   - Sets security HTTP headers
   - Protects against common vulnerabilities

4. **Rate Limiting**
   - Prevents abuse and DoS attacks
   - Configurable limits per window

5. **Input Validation**
   - Validates file types
   - Checks file size limits
   - Sanitizes request data

6. **Error Handling**
   - Generic error messages in production
   - Detailed logs for debugging
   - No sensitive data leakage

### Scaling & Performance

1. **Use nginx reverse proxy** for load balancing
2. **Enable caching** for static assets
3. **Configure CORS** for specific domains only
4. **Monitor rate limiting** thresholds
5. **Use health checks** in production orchestration
6. **Enable compression** in nginx (already configured)

### Troubleshooting

**Backend not connecting to frontend:**
- Check CORS_ORIGIN environment variable
- Verify both services are running
- Check firewall/network settings

**API key not working:**
- Verify GEMINI_API_KEY is set correctly
- Check key has transcription API enabled
- Verify API quota hasn't been exceeded

**Rate limiting issues:**
- Check RATE_LIMIT_MAX_REQUESTS setting
- Verify RATE_LIMIT_WINDOW_MS is appropriate
- Check logs for detailed rate limit info

**File too large errors:**
- Maximum file size is 15MB on frontend
- Backend validates base64 payload (≈40MB limit)
- Consider chunking for larger files

### Build Instructions

**Build everything:**
```bash
npm run build
```

**Build only backend:**
```bash
npm run build:server
```

**Start backend in production:**
```bash
npm run start:server
```

## Security Checklist for Production

- [ ] GEMINI_API_KEY is set via environment variable (never in code)
- [ ] NODE_ENV is set to `production`
- [ ] CORS_ORIGIN is restricted to your domains only
- [ ] HTTPS/TLS is enabled at reverse proxy level
- [ ] Rate limiting is tuned for your usage
- [ ] Regular backups are configured
- [ ] Monitoring and alerting are in place
- [ ] API key rotation policy is established
- [ ] Frontend CSP headers are appropriate
- [ ] Logs are centralized and monitored

## File Structure

```
/workspaces/Transcription-App/
├── server/
│   ├── src/
│   │   ├── index.ts              # Main server entry
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts   # Error handling
│   │   │   ├── logger.ts         # Request logging
│   │   │   └── rateLimiter.ts    # Rate limiting
│   │   ├── routes/
│   │   │   └── transcribe.ts     # Transcribe endpoint
│   │   └── services/
│   │       └── geminiService.ts  # Gemini API integration
│   ├── Dockerfile                # Container image
│   ├── package.json              # Dependencies
│   ├── tsconfig.json             # TypeScript config
│   └── .env.example              # Environment template
├── docker-compose.yml            # Full stack orchestration
├── Dockerfile.frontend           # Frontend container
└── nginx.conf                    # Nginx configuration
```

## Next Steps

1. Deploy backend to your hosting platform (AWS, Heroku, DigitalOcean, etc.)
2. Configure production GEMINI_API_KEY
3. Update frontend VITE_BACKEND_URL for production
4. Set up monitoring and logging
5. Configure SSL/TLS certificates
6. Implement backup strategy

For issues or questions, refer to the Express.js documentation or Gemini API docs.
