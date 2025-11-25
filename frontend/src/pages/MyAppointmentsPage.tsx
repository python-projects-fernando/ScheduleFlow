// frontend/src/pages/MyAppointmentsPage.tsx
import React, { useState, useEffect } from 'react';
import { get } from '../services/api';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import type { ListMyAppointmentsResponse, AppointmentSummary } from '../types/dtos/appointment'; // Supondo que você tenha esses DTOs
import Header from '../components/Header';

const MyAppointmentsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);

  const navigate = useNavigate(); // Obtém a função navigate

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Chama o endpoint para obter os agendamentos do usuário logado
        // O token de autenticação será automaticamente adicionado pelo 'get'
        const  ListMyAppointmentsResponse = await get('/booking/my-appointments');

        if (ListMyAppointmentsResponse.success) {
          setAppointments(ListMyAppointmentsResponse.appointments);
        } else {
          console.error("Failed to fetch appointments:", ListMyAppointmentsResponse);
          setError(ListMyAppointmentsResponse.message || "Failed to fetch appointments.");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(`An error occurred while fetching appointments: ${(err as Error).message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []); // Executa apenas uma vez ao montar o componente

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h2>

          {appointments.length === 0 ? (
            <p className="text-gray-600">You have no appointments scheduled.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id} // Usar o ID do agendamento como chave
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{appointment.service_name}</div>
                      <div className="text-sm text-gray-600 italic mt-1">
                        {/* Formatar a data e hora */}
                        {new Date(appointment.scheduled_start).toLocaleString()}
                      </div>
                    </div>
                    {/* Botão de detalhes com navegação */}
                    <button
                      onClick={() => navigate(`/booking/appointments-details/${appointment.view_token}`)} // Navega para a página de detalhes
                      className="ml-4 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                      title="View Details"
                      // Removido o 'disabled' para que o botão funcione
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyAppointmentsPage;