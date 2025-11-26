// frontend/src/pages/AdminDashboardPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

          <p className="text-gray-600 mb-8">
            Welcome to the administration panel. Manage services and appointments from here.
          </p>

          {/* Grid para os cards de ação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card: Register Services */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Register Services</h3>
              <p className="text-gray-600 mb-4">
                Manage the list of available services.
              </p>
              <Link
                to="/admin/services" // Rota para a página de gerenciamento de serviços (você criará esta página)
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Manage Services
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 -mr-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>

            {/* Card: List All Appointments */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">List All Appointments</h3>
              <p className="text-gray-600 mb-4">
                Search appointments made by clients.
              </p>
              <Link
                to="/admin/appointments" // Rota para a página de listagem de todos os agendamentos (você já tem o endpoint e pode criar a página)
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                View Appointments
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 -mr-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Mais cards podem ser adicionados aqui conforme necessário */}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminDashboardPage;