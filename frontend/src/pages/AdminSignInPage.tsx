import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { post } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { AdminLoginRequest, AdminLoginResponse } from '../types/dtos/auth';

const AdminSignInPage: React.FC = () => {
  const [formData, setFormData] = useState<AdminLoginRequest>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestBody: AdminLoginRequest = {
        username: formData.username,
        password: formData.password,
      };

      const AdminLoginResponse = await post('/auth/admin/login', requestBody);

      if (AdminLoginResponse.success && AdminLoginResponse.access_token && AdminLoginResponse.role) {
        login(AdminLoginResponse.access_token, '', AdminLoginResponse.token_type || 'bearer', AdminLoginResponse.role);
        console.log("Admin login successful:", AdminLoginResponse);
        navigate('/admin/dashboard');
      } else {
        console.error("Admin login failed:", AdminLoginResponse);
        setError(AdminLoginResponse.message || "Admin login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Network error during admin login:", err);
      setError(`An error occurred during admin login: ${(err as Error).message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Sign In</h1>
            <p className="mt-2 text-gray-600">Access the admin panel to manage appointments.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin_user"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {loading ? 'Signing In...' : 'Sign In as Admin'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminSignInPage;
