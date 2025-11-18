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

          {/* Botão de Login */}
          <div>
            <a
              href="/admin/login"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;