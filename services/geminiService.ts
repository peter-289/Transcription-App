import { GEMINI_MODEL_TRANSCRIPTION, BACKEND_URL } from '../constants';

export const transcribeAudio = async (
  base64Data: string,
  mimeType: string,
  onProgress?: (status: string) => void
): Promise<string> => {
  if (onProgress) onProgress('Initializing transcription...');

  try {
    if (onProgress) onProgress('Sending audio to server...');

    const response = await fetch(`${BACKEND_URL}/api/transcribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Data,
        mimeType
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();

    if (onProgress) onProgress('Processing response...');

    if (!data.transcription) {
      throw new Error('No transcription returned from server');
    }

    return data.transcription;
  } catch (error: any) {
    console.error('Transcription error:', error);
    throw new Error(error.message || 'Failed to transcribe audio.');
  }
};