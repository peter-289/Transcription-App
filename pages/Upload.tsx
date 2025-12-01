import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { transcribeAudio } from '../services/geminiService';
import * as storage from '../services/storage';
import { TranscriptStatus, Transcript } from '../types';
import { MAX_FILE_SIZE_MB, ALLOWED_MIME_TYPES } from '../constants';
import { UploadCloud, AlertCircle, FileAudio, X } from 'lucide-react';
import { Button } from '../components/Button';

export const Upload: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError(`Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.map(t => t.split('/')[1]).join(', ')}`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB for this demo.`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/mp3;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsProcessing(true);
    setStatusMessage('Preparing file...');

    const transcriptId = crypto.randomUUID();
    const newTranscript: Transcript = {
      id: transcriptId,
      userId: user.id,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      content: '',
      status: TranscriptStatus.PROCESSING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic save
    storage.saveTranscript(newTranscript);

    try {
      setStatusMessage('Encoding audio...');
      const base64Data = await fileToBase64(file);

      // Perform transcription
      // Note: In a real backend architecture, we would upload the file to S3/Blob storage 
      // and trigger an async job. Here we do it client-side with Gemini.
      const text = await transcribeAudio(base64Data, file.type, (msg) => setStatusMessage(msg));

      // Update transcript with result
      const completedTranscript: Transcript = {
        ...newTranscript,
        content: text,
        status: TranscriptStatus.COMPLETED,
        updatedAt: new Date().toISOString(),
        duration: 0, // We'd get this from metadata in a real backend
      };
      
      storage.saveTranscript(completedTranscript);
      navigate(`/transcripts/${transcriptId}`);

    } catch (err: any) {
      console.error(err);
      const failedTranscript: Transcript = {
        ...newTranscript,
        status: TranscriptStatus.FAILED,
        content: `Error: ${err.message}`,
        updatedAt: new Date().toISOString(),
      };
      storage.saveTranscript(failedTranscript);
      setError(err.message || 'Transcription failed.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Media</h1>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div 
            className={`max-w-xl mx-auto flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
              isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
            } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="text-center w-full">
                <FileAudio className="mx-auto h-12 w-12 text-indigo-500" />
                <p className="mt-2 text-sm text-gray-900 font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  onClick={() => setFile(null)}
                  className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                >
                  <X className="w-3 h-3 mr-1" /> Remove
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileSelect} accept="audio/*,video/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">MP3, WAV, M4A, MP4 up to {MAX_FILE_SIZE_MB}MB</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-50 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {isProcessing && (
             <div className="mt-4 space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full animate-pulse w-full"></div>
                </div>
                <p className="text-sm text-center text-gray-600">{statusMessage}</p>
             </div>
          )}

          <div className="mt-6">
            <Button 
              className="w-full" 
              onClick={handleUpload} 
              disabled={!file || isProcessing}
              isLoading={isProcessing}
            >
              {isProcessing ? 'Transcribing...' : 'Start Transcription'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
