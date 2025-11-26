// frontend/src/components/AdminHeader.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminHeader: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const navigate = useNavigate();

  if (!authState.isAuthenticated || authState.role !== 'admin') {
    console.warn("AdminHeader rendered but user is not authenticated as admin. This should ideally not happen if used within AdminProtectedRoute.");
    return null;
  }

  const handleSignOut = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold text-gray-900">ScheduleFlow Admin</a>
          </div>

          <div className="flex items-center space-x-4">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                title="Sign out of admin account"
              >
                Sign Out
              </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
