// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  tokenType: string | null;
  role: string | null;
}

interface AuthContextType {
  state: AuthState;
  login: (token: string, userId: string, tokenType?: string, role?: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    userId: null,
    tokenType: null,
    role: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    const tokenType = localStorage.getItem('token_type');
    const role = localStorage.getItem('user_role');

    if (token) {
      setState({
        isAuthenticated: true,
        token,
        userId: userId || null,
        tokenType: tokenType || null,
        role: role || null,
      });
    }
  }, []);

  const login = (token: string, userId: string, tokenType: string = 'bearer', role: string | null = null) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('token_type', tokenType);

    if (role) {
      localStorage.setItem('user_role', role);
    } else {
      localStorage.removeItem('user_role');
    }

    setState({
      isAuthenticated: true,
      token,
      userId,
      tokenType,
      role,
    });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_role');

    setState({
      isAuthenticated: false,
      token: null,
      userId: null,
      tokenType: null,
      role: null,
    });

    navigate('/');
  };

  const getToken = (): string | null => {
    return state.token;
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
