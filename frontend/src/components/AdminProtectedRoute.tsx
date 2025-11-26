// frontend/src/components/AdminProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Certifique-se do caminho correto para o hook

interface AdminProtectedRouteProps {
  children: React.ReactNode; // O componente filho que deve ser protegido
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { state: authState } = useAuth(); // Obtém o estado de autenticação

  // Verifica se o usuário está autenticado E se o papel é 'admin'
  if (!authState.isAuthenticated || authState.role !== 'admin') {
    // Se NÃO estiver autenticado ou o papel NÃO for 'admin', redireciona
    console.log("Access denied: User is not an admin or not authenticated. Redirecting to home.");
    return <Navigate to="/" replace />; // Redireciona para a home page
  }

  // Se estiver autenticado e for admin, renderiza o componente filho
  return <>{children}</>;
};

export default AdminProtectedRoute;