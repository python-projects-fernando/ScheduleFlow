// frontend/src/components/AdminFooter.tsx
import React from 'react';

const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Ajusta para 2 colunas apenas */}
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ScheduleFlow Admin</h3> {/* Opcional: Adicionar "Admin" ao nome */}
            <p className="text-gray-400">
              Administration panel for managing appointments and services.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Support</h3> {/* Opcional: Mudar título para algo mais específico de admin */}
            <address className="not-italic text-gray-400">
              <p>Email: <a href='mailto:contact@fmbyteshiftsoftware.com'>contact@fmbyteshiftsoftware.com</a></p> {/* Opcional: Usar email específico de suporte admin */}
              {/* Adicione outros meios de contato específicos para admin, se houver */}
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center"> {/* Adiciona uma linha divisória opcional */}
          <p className="text-gray-400">&copy; {new Date().getFullYear()} ScheduleFlow Admin. All rights reserved.</p> {/* Opcional: Atualizar copyright */}
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;