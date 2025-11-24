// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Definindo a interface para o estado de autenticação
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  tokenType: string | null;
}

// Definindo a interface para as funções do contexto
interface AuthContextType {
  state: AuthState;
  login: (token: string, userId: string, tokenType?: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

// Valor padrão do contexto (inicializado como não autenticado)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente provedor do contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    userId: null,
    tokenType: null,
  });

  const navigate = useNavigate();

  // Função para carregar o estado inicial do localStorage quando o componente monta
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    const tokenType = localStorage.getItem('token_type');

    if (token) {
      setState({
        isAuthenticated: true,
        token,
        userId: userId || null, // Garante null se não existir
        tokenType: tokenType || null, // Garante null se não existir
      });
    }
  }, []); // Executa apenas uma vez ao montar

  // Função para login
  const login = (token: string, userId: string, tokenType: string = 'bearer') => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('token_type', tokenType);

    setState({
      isAuthenticated: true,
      token,
      userId,
      tokenType,
    });
  };

  // Função para logout
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('token_type');

    setState({
      isAuthenticated: false,
      token: null,
      userId: null,
      tokenType: null,
    });

    // Opcional: Redirecionar após logout
    navigate('/'); // ou '/auth/signin'
  };

  // Função para obter o token atual (útil para chamadas de API)
  const getToken = (): string | null => {
    return state.token;
  };

  // O valor fornecido pelo contexto
  const value: AuthContextType = {
    state,
    login,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};