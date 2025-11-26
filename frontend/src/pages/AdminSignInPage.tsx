// frontend/src/pages/AdminSignInPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionamento após login
import Header from '../components/Header';
import Footer from '../components/Footer';
import { post } from '../services/api'; // Importa a função post genérica
import { useAuth } from '../hooks/useAuth'; // Importa o hook de autenticação
import type { AdminLoginRequest, AdminLoginResponse } from '../types/dtos/auth'; // Tipos específicos para login de admin (você precisa criar isso)

const AdminSignInPage: React.FC = () => {
  const [formData, setFormData] = useState<AdminLoginRequest>({ // Usa o tipo AdminLoginRequest
    username: '', // Campo 'username' em vez de 'email'
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Hook para navegação
  const { login } = useAuth(); // Hook para obter a função de login do contexto
  // Supondo que a função 'login' do contexto aceite token, userId (opcional), e token_type
  // Se o contexto distinguir entre usuário e admin, talvez tenha uma função específica para admin
  // ou um parâmetro adicional. Por enquanto, assumirei que a mesma função 'login' é usada,
  // e o tipo de usuário é inferido do token JWT pelo backend ou armazenado separadamente se necessário.

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

      const  AdminLoginResponse = await post('/auth/admin/login', requestBody);

      if (AdminLoginResponse.success && AdminLoginResponse.access_token && AdminLoginResponse.role) { // Verifica se 'role' também está presente
        // --- CHAMADA ATUALIZADA PARA LOGIN ---
        // Passa o token, userId (pode ser vazio ou um ID específico de admin), token_type e o papel
        // Se o admin não tiver um 'userId' no mesmo formato que um user comum, você pode passar uma string vazia ou um ID especial, ou talvez só o papel importe aqui.
        // A lógica de como lidar com o ID de admin depende do seu backend e do que você armazena associado ao token.
        // Para esta demonstração, assumirei que o backend pode associar o papel ao token mesmo sem um 'user_id' tradicional, ou que você gere um ID específico para admin se necessário.
        // Por enquanto, passamos userId como vazio, o papel é o que importa para distinguir.
        login(AdminLoginResponse.access_token, '', AdminLoginResponse.token_type || 'bearer', AdminLoginResponse.role); // Passa o papel

        console.log("Admin login successful:", AdminLoginResponse);
        // alert(AdminLoginResponse.message || "Admin login successful!");
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
      {/* Header */}
      <Header />

      {/* Main Content */}
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
                type="text" // Tipo 'text' para username
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

            {/* Opcional: Lembrar-me */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-admin"
                  name="remember-admin"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-admin" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
            </div> */}

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

          {/* Opcional: Link para voltar à Home ou algo do tipo */}
          {/* <div className="text-center text-sm text-gray-600">
            Go back to <a href="/" className="font-medium text-blue-600 hover:text-blue-500">Home</a>.
          </div> */}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminSignInPage;