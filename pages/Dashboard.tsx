import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import * as storage from '../services/storage';
import { Transcript, TranscriptStatus } from '../types';
import { 
  FileAudio, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, hours: 0 });

  useEffect(() => {
    if (user) {
      const data = storage.getTranscripts(user.id);
      setTranscripts(data);
      
      // Calculate stats
      const total = data.length;
      const completed = data.filter(t => t.status === TranscriptStatus.COMPLETED).length;
      const pending = data.filter(t => t.status === TranscriptStatus.PROCESSING || t.status === TranscriptStatus.PENDING).length;
      const totalSeconds = data.reduce((acc, curr) => acc + (curr.duration || 0), 0);
      
      setStats({
        total,
        completed,
        pending,
        hours: Math.round((totalSeconds / 3600) * 10) / 10
      });
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <Link to="/upload" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-5 h-5 mr-2" />
          New Transcription
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileAudio className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Transcripts</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Processing</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Hours Transcribed</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.hours}h</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transcripts</h3>
          <Link to="/transcripts" className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {transcripts.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500">
              No transcripts yet. Upload a file to get started!
            </li>
          ) : (
            transcripts.slice(0, 5).map((t) => (
              <li key={t.id}>
                <Link to={`/transcripts/${t.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{t.fileName}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${t.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                            t.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {t.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <FileAudio className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {(t.fileSize / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>Uploaded {new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
