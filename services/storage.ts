import { Transcript, User, TranscriptStatus } from '../types';

const STORAGE_KEYS = {
  USERS: 'scribeflow_users',
  TRANSCRIPTS: 'scribeflow_transcripts',
  SESSION: 'scribeflow_session'
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- User Storage ---

export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersJson ? JSON.parse(usersJson) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

// --- Transcript Storage ---

export const getTranscripts = (userId: string): Transcript[] => {
  const allTranscripts: Transcript[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSCRIPTS) || '[]');
  return allTranscripts
    .filter(t => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getTranscriptById = (id: string): Transcript | undefined => {
  const allTranscripts: Transcript[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSCRIPTS) || '[]');
  return allTranscripts.find(t => t.id === id);
};

export const saveTranscript = (transcript: Transcript): void => {
  const allTranscripts: Transcript[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSCRIPTS) || '[]');
  const index = allTranscripts.findIndex(t => t.id === transcript.id);
  
  if (index >= 0) {
    allTranscripts[index] = transcript;
  } else {
    allTranscripts.push(transcript);
  }
  
  localStorage.setItem(STORAGE_KEYS.TRANSCRIPTS, JSON.stringify(allTranscripts));
};

export const deleteTranscript = (id: string): void => {
  let allTranscripts: Transcript[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSCRIPTS) || '[]');
  allTranscripts = allTranscripts.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRANSCRIPTS, JSON.stringify(allTranscripts));
};

// --- Session ---

export const getSession = () => {
  return localStorage.getItem(STORAGE_KEYS.SESSION);
};

export const setSession = (token: string) => {
  localStorage.setItem(STORAGE_KEYS.SESSION, token);
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};
