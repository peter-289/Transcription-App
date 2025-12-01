# ScribeFlow - Production-Ready Transcription App

A secure, full-stack application for audio/video transcription using Google's Gemini AI. **API keys are never exposed to the frontend.**

## 🎯 Key Features

- ✅ **Secure Backend Architecture** - API key stored safely on backend only
- ✅ **Audio/Video Transcription** - Support for MP3, WAV, M4A, OGG, WEBM, MP4, etc.
- ✅ **Rate Limiting** - Built-in protection against abuse
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **Docker Support** - Full Docker & Docker Compose setup
- ✅ **Production Ready** - Security headers, compression, CORS
- ✅ **TypeScript** - Full type safety across frontend and backend
- ✅ **CORS Protection** - Configurable allowed origins
- ✅ **Health Checks** - Built-in monitoring endpoints

## 🏗️ Architecture

```
Frontend (React + Vite)  →  Backend (Node.js/Express)  →  Gemini API
Port 5173                    Port 3001                    Google Cloud
(No API Keys)                (Secure API Key)             AI Service
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Gemini API key (get it from [Google AI Studio](https://aistudio.google.com))

### Installation

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Create environment files
cp .env.example .env
cp server/.env.example server/.env

# Add your Gemini API key to server/.env
# GEMINI_API_KEY=your_actual_key_here
```

### Development

**Option 1: Run both frontend and backend**
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

Visit `http://localhost:5173`

### Docker Deployment

```bash
# Build and start with Docker Compose
docker-compose up --build

# The app will be at http://localhost:5173
# Backend API at http://localhost:3001
```

## 🔒 Security

### API Key Protection
- **NEVER** committed to git (see `.gitignore`)
- **ONLY** stored in backend environment variables
- **NOT** exposed in frontend code or network requests
- **NOT** included in build artifacts

### Additional Security Features
- Helmet.js for secure HTTP headers
- CORS protection with configurable origins
- Rate limiting (100 requests/15min by default)
- Input validation on all endpoints
- Error handling without sensitive data leakage
- Non-root Docker user

### Before Going to Production
1. ✅ Set `NODE_ENV=production`
2. ✅ Configure `CORS_ORIGIN` to your domain only
3. ✅ Enable HTTPS/TLS at reverse proxy
4. ✅ Rotate and secure your Gemini API key
5. ✅ Set up monitoring and alerting
6. ✅ Review and update rate limiting settings

## 📁 Project Structure

```
Transcription-App/
├── src/                          # Frontend source
│   ├── pages/                    # Page components
│   ├── components/               # React components
│   ├── services/                 # API services (calls backend)
│   ├── contexts/                 # React Context
│   └── App.tsx                   # Main app
├── server/                       # Backend source
│   ├── src/
│   │   ├── index.ts              # Express server
│   │   ├── routes/               # API routes
│   │   ├── services/             # Gemini API integration
│   │   └── middleware/           # Express middleware
│   ├── Dockerfile                # Backend container
│   ├── tsconfig.json
│   └── package.json
├── docker-compose.yml            # Full stack orchestration
├── Dockerfile.frontend           # Frontend Nginx container
├── nginx.conf                    # Nginx configuration
├── BACKEND_SETUP.md              # Backend setup guide
├── PRODUCTION_DEPLOYMENT.md      # Production deployment guide
└── README.md                     # This file
```

## 📚 Documentation

- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Detailed backend setup and API documentation
- **[PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)** - Production deployment guides for various platforms

## 🔌 API Endpoints

### POST `/api/transcribe`
Transcribe audio/video content.

**Request:**
```json
{
  "base64Data": "base64_encoded_file",
  "mimeType": "audio/mp3"
}
```

**Response:**
```json
{
  "success": true,
  "transcription": "The transcribed text content...",
  "timestamp": "2024-12-01T10:00:00Z"
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-01T10:00:00Z",
  "environment": "production"
}
```

## 🎨 Frontend Features

- User authentication (mock-based currently)
- File upload with drag-and-drop
- Real-time transcription progress
- Transcript storage and retrieval
- Responsive UI with Tailwind CSS

## ⚙️ Environment Variables

### Frontend (`.env`)
```
VITE_BACKEND_URL=http://localhost:3001
```

### Backend (`server/.env`)
```
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional
PORT=3001
NODE_ENV=development
GEMINI_MODEL=gemini-2.5-flash
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚢 Deployment

### Local Docker
```bash
docker-compose up --build
```

### Platforms Supported
- Heroku (backend only)
- DigitalOcean App Platform
- AWS (ECS/Fargate)
- Vercel (frontend) + Railway/Render (backend)
- Self-hosted (Docker on Ubuntu/Debian)

See **[PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)** for detailed instructions.

## 📊 Supported File Types

**Audio:**
- MP3, WAV, M4A, OGG, WEBM

**Video:**
- MP4, MPEG, WEBM

**Maximum Size:** 15MB (configurable)

## 🔧 Development Commands

```bash
# Install all dependencies
npm run install:all

# Start development environment
npm run dev:full

# Build for production
npm run build

# Build backend for production
npm run build:server

# Start production backend server
npm run start:server

# Start everything with Docker
docker-compose up --build
```

## 🐛 Troubleshooting

### Backend not connecting
- Ensure backend is running (`npm run dev:server`)
- Check `CORS_ORIGIN` environment variable
- Verify port 3001 is accessible

### API key not working
- Verify key is in `server/.env` (not `.env`)
- Check key has transcription API enabled
- Ensure key hasn't been rotated/revoked

### File too large error
- Frontend limit: 15MB
- Backend limit: ~40MB (base64 encoded)
- Consider chunking for larger files in future

### Rate limiting issues
- Default: 100 requests/15 minutes
- Adjust `RATE_LIMIT_MAX_REQUESTS` in backend `.env`

## 🔐 Security Checklist

Before production deployment:
- [ ] GEMINI_API_KEY is in environment (not code)
- [ ] NODE_ENV set to `production`
- [ ] CORS_ORIGIN restricted to your domains
- [ ] HTTPS/TLS enabled
- [ ] Rate limiting appropriate for usage
- [ ] Monitoring and alerting configured
- [ ] Backup strategy established
- [ ] Security headers verified
- [ ] API key rotation policy in place

## 📝 License

This project is part of the ScribeFlow transcription application.

## 🤝 Contributing

1. Create a feature branch
2. Implement your changes
3. Ensure sensitive data is not committed (check `.gitignore`)
4. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the documentation files (BACKEND_SETUP.md, PRODUCTION_DEPLOYMENT.md)
2. Review backend logs: `docker-compose logs backend -f`
3. Verify environment variables: `docker-compose config`
4. Test health endpoint: `curl http://localhost:3001/health`

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Google Gemini API Documentation](https://ai.google.dev/tutorials)
- [React Documentation](https://react.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [Vite Documentation](https://vitejs.dev/)

---

**Built with security and production-readiness in mind.** 🛡️
