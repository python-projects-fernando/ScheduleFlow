// frontend/src/components/AdminProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { state: authState } = useAuth();

  if (!authState.isAuthenticated || authState.role !== 'admin') {
    console.log("Access denied: User is not an admin or not authenticated. Redirecting to home.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
