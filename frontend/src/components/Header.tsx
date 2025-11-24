// frontend/src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {/* O logotipo geralmente é um link para a página inicial */}
            <a href="/" className="text-xl font-bold text-gray-900">ScheduleFlow</a>
          </div>

          {/* Navegação */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {/* REMOVIDO: <li><a href="/" className="text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out">Home</a></li> */}
              <li>
                <a href="/booking" className="text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out">
                  Book Appointment
                </a>
              </li>
              {/* Adicione mais links conforme necessário */}
            </ul>
          </nav>

          {/* Botões de Autenticação (Sign In / Sign Up) */}
          <div className="flex items-center space-x-4">
            <a
              href="/auth/signin" // Link para a página de login
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
            >
              Sign In
            </a>
            <a
              href="/auth/signup" // Link para a página de cadastro
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;