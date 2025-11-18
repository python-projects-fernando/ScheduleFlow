// frontend/src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-800" >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ScheduleFlow</h3>
            <p className="text-gray-400">
              Automate your appointments. Streamline your business.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">              
              <li><a href="/booking" className="text-gray-400 hover:text-white transition duration-150 ease-in-out">Book Now</a></li>
              <li><a href="/admin/login" className="text-gray-400 hover:text-white transition duration-150 ease-in-out">Admin Login</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-400">
              <p>Email: contact@fmbyteshiftsoftware.com</p>
              {/* Adicione outros meios de contato */}
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} ScheduleFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;