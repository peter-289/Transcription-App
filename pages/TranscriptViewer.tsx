import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as storage from '../services/storage';
import { Transcript } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Save, Trash2, Download } from 'lucide-react';

export const TranscriptViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const data = storage.getTranscriptById(id);
      if (data) {
        setTranscript(data);
        setEditedContent(data.content);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, navigate]);

  const handleSave = async () => {
    if (!transcript) return;
    setIsSaving(true);
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    
    const updated = { ...transcript, content: editedContent, updatedAt: new Date().toISOString() };
    storage.saveTranscript(updated);
    setTranscript(updated);
    setIsSaving(false);
  };

  const handleDelete = () => {
    if (id && window.confirm('Are you sure you want to delete this transcript?')) {
      storage.deleteTranscript(id);
      navigate('/dashboard');
    }
  };

  const handleDownload = () => {
    if (!transcript) return;
    const blob = new Blob([editedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${transcript.fileName.split('.')[0]}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!transcript) return null;

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{transcript.fileName}</h1>
            <p className="text-sm text-gray-500">
              {new Date(transcript.createdAt).toLocaleString()} • {(transcript.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <Button variant="ghost" onClick={handleDownload} title="Download Text">
            <Download className="w-5 h-5" />
          </Button>
          <Button variant="danger" onClick={handleDelete} title="Delete">
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-white shadow rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Transcript Editor</span>
            {transcript.status === 'FAILED' && <span className="text-red-600 text-sm font-bold">Failed</span>}
        </div>
        <textarea
          className="flex-1 w-full p-6 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-gray-800 leading-relaxed font-mono text-base"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          placeholder="Transcription content will appear here..."
        />
      </div>
    </div>
  );
};
