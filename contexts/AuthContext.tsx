import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User, UserRole } from '../types';
import * as storage from '../services/storage';
import { MOCK_DELAY } from '../constants';

interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getSession();
      if (token) {
        // In a real app, verify token validity with backend.
        // Here, we just decode the "token" which is just the userId in our mock.
        const userId = token; 
        const users = storage.getUsers();
        const user = users.find(u => u.id === userId);
        
        if (user) {
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
            storage.clearSession();
            setState(s => ({ ...s, isLoading: false }));
        }
      } else {
        setState(s => ({ ...s, isLoading: false }));
      }
    };
    initAuth();
  }, []);

  const login = async (email: string) => {
    // Mock login
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    
    const user = storage.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found.");
    }

    const token = user.id; // Mock token
    storage.setSession(token);
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const register = async (name: string, email: string) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    
    const existing = storage.findUserByEmail(email);
    if (existing) {
      throw new Error("Email already registered.");
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };

    storage.saveUser(newUser);
    const token = newUser.id;
    storage.setSession(token);
    
    setState({
      user: newUser,
      token,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    storage.clearSession();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const updateProfile = async (data: Partial<User>) => {
      if(!state.user) return;
      await new Promise(r => setTimeout(r, MOCK_DELAY));
      const updatedUser = { ...state.user, ...data };
      storage.saveUser(updatedUser);
      setState(prev => ({ ...prev, user: updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
