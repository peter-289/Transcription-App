import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Landing } from './pages/Landing';
import { Login, Register } from './pages/AuthPages';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { TranscriptViewer } from './pages/TranscriptViewer';

// Placeholder for Profile and List pages
const Profile = () => <div className="p-4">Profile Settings (Coming Soon)</div>;
const TranscriptList = () => <div className="p-4"><Navigate to="/dashboard" /></div>;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute />}>
             <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
             <Route path="/upload" element={<Layout><Upload /></Layout>} />
             <Route path="/transcripts" element={<Layout><TranscriptList /></Layout>} />
             <Route path="/transcripts/:id" element={<Layout><TranscriptViewer /></Layout>} />
             <Route path="/profile" element={<Layout><Profile /></Layout>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;