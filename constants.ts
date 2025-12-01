export const APP_NAME = 'ScribeFlow';
export const MAX_FILE_SIZE_MB = 15; // Client-side limit for base64 handling
export const ALLOWED_MIME_TYPES = [
  'audio/mp3',
  'audio/mpeg',
  'audio/wav',
  'audio/x-m4a',
  'audio/ogg',
  'audio/webm',
  'video/mp4',
  'video/mpeg',
  'video/webm'
];

export const MOCK_DELAY = 800; // Simulate network latency

export const GEMINI_MODEL_TRANSCRIPTION = 'gemini-2.5-flash';

// Backend API Configuration
const isDevelopment = import.meta.env.DEV;
export const BACKEND_URL = isDevelopment 
  ? 'http://localhost:3001'
  : process.env.VITE_BACKEND_URL || '/api';
