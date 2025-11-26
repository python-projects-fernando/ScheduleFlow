// frontend/src/components/AdminHeader.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth'; // Importa o hook de autenticação
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const AdminHeader: React.FC = () => {
  const { state: authState, logout } = useAuth(); // Obtém o estado e a função de logout
  const navigate = useNavigate(); // Hook para navegação

  // Apenas mostra o header se o usuário estiver autenticado como admin (opcional, mas robusto)
  // Se o componente for usado apenas em rotas protegidas por AdminProtectedRoute, esta verificação é redudante
  // mas pode servir como segurança adicional.
  if (!authState.isAuthenticated || authState.role !== 'admin') {
    console.warn("AdminHeader rendered but user is not authenticated as admin. This should ideally not happen if used within AdminProtectedRoute.");
    return null; // Ou uma mensagem de erro temporária
  }

  const handleSignOut = () => {
    logout(); // Chama a função de logout do contexto
    // Opcional: Navegar para a página inicial ou login após o logout
    // navigate('/'); // Descomente se quiser redirecionar
    // navigate('/auth/admin-signin'); // Ou redirecione para a página de login de admin
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Nome da Aplicação (Apenas texto ou logo, sem link para home se for a página principal do admin) */}
          <div className="flex-shrink-0">
            {/* Opcional: Pode manter o link para '/' ou remover se estiver na página principal do admin */}
            <a href="/" className="text-xl font-bold text-gray-900">ScheduleFlow Admin</a> {/* Nome da aplicação com sufixo "Admin" ou ícone diferente se desejar */}
          </div>

          {/* Botão de Sign Out (único botão de autenticação no contexto do admin) */}
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