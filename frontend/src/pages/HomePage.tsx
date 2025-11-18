import React from 'react';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            <span className="text-blue-600">Automate</span> Your Appointments
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Transform how your business handles appointments. Eliminate back-and-forth scheduling and provide a professional, effortless booking experience for your clients.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/booking" // Link para a página de agendamento
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Book Now
            </a>
            <a
              href="#features" // Link para a seção de features
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose ScheduleFlow?
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Designed to solve common scheduling problems with simplicity and efficiency.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature Card 1 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              <div className="flex justify-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                  {/* Ícone SVG ou Font Awesome - Exemplo com ícone de relógio */}
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Reduce No-Shows</h3>
              <p className="text-gray-600 text-center">
                Automated confirmation and reminder emails/SMS keep clients informed and engaged, significantly lowering missed appointments.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              <div className="flex justify-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600">
                  {/* Ícone SVG ou Font Awesome - Exemplo com ícone de calendário */}
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Save Time & Resources</h3>
              <p className="text-gray-600 text-center">
                Stop manual coordination. Clients book instantly online, freeing up your staff for what matters most.
              </p>
            </div>

            {/* Feature Card 3 - Atualizado */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              <div className="flex justify-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600">
                  {/* Ícone SVG ou Font Awesome - Exemplo com ícone de usuário */}
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Enhance Customer Experience</h3>
              <p className="text-gray-600 text-center">
                Offer 24/7 availability and effortless rescheduling. Manage your appointments with ease. View details or cancel anytime using secure, private links sent directly to you, with no login required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to streamline your scheduling process?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
            Join countless businesses already benefiting from automated scheduling.
          </p>
          <div className="mt-10">
            <a
              href="/booking"
              className="inline-block px-8 py-4 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 shadow-lg transition duration-150 ease-in-out"
            >
              Start Scheduling Today
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;