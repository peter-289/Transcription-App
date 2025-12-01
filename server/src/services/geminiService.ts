import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

const client = new GoogleGenAI({ apiKey });

export const transcribeWithGemini = async (
  base64Data: string,
  mimeType: string
): Promise<string> => {
  try {
    const prompt = `
      You are a professional transcriptionist. 
      Transcribe the audio in the provided file exactly as spoken. 
      Do not add any commentary, timestamps, or speaker labels unless they are very clear.
      Format the output as clean paragraphs.
    `;

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const response = await client.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('No transcription text returned from the model');
    }

    return text;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error(error.message || 'Failed to transcribe audio with Gemini API');
  }
};
