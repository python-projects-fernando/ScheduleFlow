// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Interface atualizada para o estado de autenticação ---
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  tokenType: string | null;
  role: string | null; // <-- NOVO CAMPO
}

// --- Interface atualizada para as funções do contexto ---
interface AuthContextType {
  state: AuthState; // <-- Agora inclui 'role'
  // --- Atualizar a assinatura da função 'login' ---
  login: (token: string, userId: string, tokenType?: string, role?: string) => void; // <-- 'role' adicionado
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // --- Estado atualizado ---
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    userId: null,
    tokenType: null,
    role: null, // <-- Inicializado como null
  });

  const navigate = useNavigate();

  // --- Efeito para carregar o estado inicial do localStorage ---
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    const tokenType = localStorage.getItem('token_type');
    // --- Ler o papel do localStorage ---
    const role = localStorage.getItem('user_role'); // <-- Ler do localStorage

    if (token) {
      setState({
        isAuthenticated: true,
        token,
        userId: userId || null,
        tokenType: tokenType || null,
        role: role || null, // <-- Armazenar o papel ou null
      });
    }
  }, []);

  // --- Função de login atualizada ---
  const login = (token: string, userId: string, tokenType: string = 'bearer', role: string | null = null) => { // <-- Parâmetro 'role' adicionado com default null
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('token_type', tokenType);
    // --- Armazenar o papel no localStorage ---
    if (role) {
      localStorage.setItem('user_role', role); // <-- Salvar papel se fornecido
    } else {
      localStorage.removeItem('user_role'); // <-- Remover papel se não for fornecido (caso de login comum)
    }

    setState({
      isAuthenticated: true,
      token,
      userId,
      tokenType,
      role, // <-- Armazenar papel no estado
    });
  };

  // --- Função de logout atualizada ---
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_role'); // <-- Remover papel ao fazer logout

    setState({
      isAuthenticated: false,
      token: null,
      userId: null,
      tokenType: null,
      role: null, // <-- Limpar papel
    });

    navigate('/');
  };

  const getToken = (): string | null => {
    return state.token;
  };

  const value: AuthContextType = {
    state, // <-- Agora inclui 'role'
    login, // <-- Agora aceita 'role'
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