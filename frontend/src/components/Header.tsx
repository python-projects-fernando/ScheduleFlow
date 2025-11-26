import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold text-gray-900">ScheduleFlow</a>
          </div>

          <div className="flex items-center space-x-4">
            {authState.isAuthenticated ? (
              <>
                <a
                  href="/booking/my-appointments"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
                >
                  My Appointments
                </a>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
                >
                  Sign In
                </a>
                <a
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
