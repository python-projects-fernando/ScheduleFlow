// frontend/src/pages/SignInPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionamento após login
import Header from '../components/Header';
import Footer from '../components/Footer';
import { post } from '../services/api'; // Importa a função post genérica
import type { LoginRequest, LoginResponse } from '../types/dtos/auth'; // Assumindo que você crie esses tipos

const SignInPage: React.FC = () => {
  const [formData, setFormData] = useState<Omit<LoginRequest, 'grant_type' | 'scope' | 'client_id' | 'client_secret'>>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Hook para navegação

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Preparar o body da requisição
      const requestBody: LoginRequest = {
        email: formData.email,
        password: formData.password,
      };

      // 2. Fazer a requisição POST usando a função genérica 'post' do api.ts
      // A URL base (ex: http://localhost:8000/api) é adicionada automaticamente pela função 'post'
      const data: LoginResponse = await post('/auth/login', requestBody); // Tipa a resposta

      // 3. Tratar a resposta
      if (data.success && data.access_token) {
        // 4. Armazenar o token JWT no localStorage (ou sessionStorage)
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_id', data.user_id || ''); // Opcional: armazenar ID do usuário
        localStorage.setItem('token_type', data.token_type || 'bearer'); // Opcional: armazenar tipo do token

        // 5. Redirecionar para a página de destino (ex: Home, Dashboard, ou onde o usuário tentava acessar)
        console.log("Login successful:", data);        
        navigate('/booking'); // Ou '/dashboard', ou a rota que você desejar após o login
      } else {
        // 6. Lidar com falha no login
        console.error("Login failed:", data);
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Network error during login:", err);
      // A função 'post' lança um erro, então este catch captura erros de rede ou erros HTTP não ok
      // O erro pode vir com uma mensagem específica do backend via apiRequest
      setError(`An error occurred during login: ${(err as Error).message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="mt-2 text-gray-600">Access your account to manage appointments.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              {/* <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div> */}
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
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/auth/signup" // Link para a página de cadastro
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up here
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignInPage;