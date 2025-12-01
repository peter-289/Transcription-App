import { Request, Response, NextFunction } from 'express';
import { transcribeWithGemini } from '../services/geminiService.js';

interface TranscribeRequest {
  base64Data: string;
  mimeType: string;
}

export const transcribeAudioHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { base64Data, mimeType } = req.body as TranscribeRequest;

    // Validation
    if (!base64Data || typeof base64Data !== 'string') {
      return res.status(400).json({
        error: 'Bad request',
        message: 'base64Data is required and must be a string'
      });
    }

    if (!mimeType || typeof mimeType !== 'string') {
      return res.status(400).json({
        error: 'Bad request',
        message: 'mimeType is required and must be a string'
      });
    }

    // Validate mimeType
    const allowedMimeTypes = [
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

    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({
        error: 'Bad request',
        message: `Invalid mimeType. Allowed types: ${allowedMimeTypes.join(', ')}`
      });
    }

    // Check base64 size (max ~30MB in base64 is roughly 22.5MB original)
    if (base64Data.length > 40 * 1024 * 1024) {
      return res.status(413).json({
        error: 'Request entity too large',
        message: 'Audio file is too large. Maximum 15MB.'
      });
    }

    console.log(`Processing transcription request for ${mimeType}`);

    // Call Gemini API
    const transcription = await transcribeWithGemini(base64Data, mimeType);

    res.json({
      success: true,
      transcription,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Transcribe handler error:', error);
    next(error);
  }
};
