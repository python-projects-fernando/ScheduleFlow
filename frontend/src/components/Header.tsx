import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">ScheduleFlow</h1>
          </div>

          {/* Navegação (opcional para MVP, pode ser apenas um espaço reservado) */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <a href="/" className="text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out">
                  Home
                </a>
              </li>
              <li>
                <a href="/booking" className="text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out">
                  Book Appointment
                </a>
              </li>
              {/* Adicione mais links conforme necessário */}
            </ul>
          </nav>

          {/* Botão de Login (opcional para cliente, talvez para admin) */}
          <div>
            <a
              href="/admin/login" // ou "/login" se for login de cliente
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