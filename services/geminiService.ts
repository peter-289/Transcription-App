import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_TRANSCRIPTION } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const transcribeAudio = async (
  base64Data: string,
  mimeType: string,
  onProgress?: (status: string) => void
): Promise<string> => {
  if (onProgress) onProgress('Initializing AI model...');

  try {
    const prompt = `
      You are a professional transcriptionist. 
      Transcribe the audio in the provided file exactly as spoken. 
      Do not add any commentary, timestamps, or speaker labels unless they are very clear.
      Format the output as clean paragraphs.
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TRANSCRIPTION,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    if (onProgress) onProgress('Processing response...');
    
    const text = response.text;
    if (!text) {
      throw new Error("No transcription text returned from the model.");
    }
    
    return text;

  } catch (error: any) {
    console.error("Transcription error:", error);
    throw new Error(error.message || "Failed to transcribe audio.");
  }
};