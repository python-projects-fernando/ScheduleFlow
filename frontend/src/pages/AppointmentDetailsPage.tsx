// frontend/src/pages/AppointmentDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, post } from '../services/api'; // Importa 'post' para cancelamento
import type { GetAppointmentDetailsResponse, AppointmentDetails } from '../types/dtos/appointment'; // Tipos atualizados
import Header from '../components/Header';

const AppointmentDetailsPage: React.FC = () => {
  const { viewToken } = useParams<{ viewToken: string }>(); // Obtém o viewToken da URL
  const navigate = useNavigate(); // Para navegação após cancelamento ou erro

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Função para buscar os detalhes do agendamento
  const fetchAppointmentDetails = async () => {
    if (!viewToken) {
      setError("View token is missing.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching appointment details for token:", viewToken);
      // Chama o endpoint para obter os detalhes do agendamento usando o view_token
      // Tipa a resposta como GetAppointmentDetailsResponse
      const  GetAppointmentDetailsResponse = await get(`/booking/details/${viewToken}`);

      if (GetAppointmentDetailsResponse.success && GetAppointmentDetailsResponse.appointment_id) { // Verifica sucesso e presença de dados
        // Mapeia a resposta da API para o tipo AppointmentDetails
        const mappedDetails: AppointmentDetails = {
          id: GetAppointmentDetailsResponse.appointment_id,
          client_name: GetAppointmentDetailsResponse.client_name || '',
          client_email: GetAppointmentDetailsResponse.client_email || '',
          client_phone: GetAppointmentDetailsResponse.client_phone || '',
          service_name: GetAppointmentDetailsResponse.service_name || '',
          service_description: GetAppointmentDetailsResponse.service_description || '',
          service_duration_minutes: GetAppointmentDetailsResponse.service_duration_minutes || 0,
          service_price: GetAppointmentDetailsResponse.service_price || 0,
          service_type: GetAppointmentDetailsResponse.service_type || '',
          scheduled_start: GetAppointmentDetailsResponse.scheduled_start || '',
          scheduled_end: GetAppointmentDetailsResponse.scheduled_end || '',
          status: GetAppointmentDetailsResponse.status || '',
          created_at: GetAppointmentDetailsResponse.created_at || '',
          updated_at: GetAppointmentDetailsResponse.updated_at || '',
          view_token: viewToken, // Pode vir da resposta ou ser o token usado para busca
          cancellation_token: GetAppointmentDetailsResponse.cancellation_token || '' // Assume que vem da resposta
        };
        setAppointmentDetails(mappedDetails);
        console.log("Appointment details fetched and mapped:", mappedDetails);
      } else {
        console.error("Failed to fetch appointment details:", GetAppointmentDetailsResponse);
        setError(GetAppointmentDetailsResponse.message || "Failed to fetch appointment details.");
      }
    } catch (err) {
      console.error("Error fetching appointment details:", err);
      setError(`An error occurred while fetching details: ${(err as Error).message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // Busca os detalhes quando o componente monta ou quando o viewToken muda
  useEffect(() => {
    fetchAppointmentDetails();
  }, [viewToken]); // Dependência no viewToken

  // Função para cancelar o agendamento
  const handleCancelAppointment = async () => {
    if (!appointmentDetails) {
      console.error("Cannot cancel, appointment details not loaded.");
      setError("Appointment details not loaded.");
      return;
    }

    // Envia o cancellation_token para cancelar
    const cancelRequest = {
        cancellation_token: appointmentDetails.cancellation_token
    };

    setIsCancelling(true);
    setError(null); // Limpa erro anterior

    try {
      console.log("Cancelling appointment with token:", appointmentDetails.cancellation_token);
      // Supondo um endpoint POST /api/booking/cancel-by-token
      const cancelResponse = await post('/booking/cancel', cancelRequest);

      if (cancelResponse.success) {
        console.log("Appointment cancelled successfully!");
        alert("Appointment cancelled successfully!");
        // Opcional: Redirecionar para a lista de agendamentos ou para a home
        navigate('/booking/my-appointments');
      } else {
        console.error("Failed to cancel appointment:", cancelResponse);
        setError(cancelResponse.message || "Failed to cancel appointment.");
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      setError(`An error occurred while cancelling: ${(err as Error).message || "Unknown error"}`);
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Loading appointment details...</p>
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

  if (!appointmentDetails) {
    // Este caso pode ocorrer se a API retornar success=true mas sem dados, ou se houve um erro não capturado pelo catch
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Appointment details not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Details</h2>

          {/* Div de detalhes do agendamento, baseado no layout da lista */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            {/* Linha 1: Nome do Serviço e Tipo */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{appointmentDetails.service_name}</div>
                <div className="text-sm text-gray-600 italic mt-1">{appointmentDetails.service_type}</div>
              </div>
            </div>

            {/* Linha 2: Descrição do Serviço */}
            {appointmentDetails.service_description && (
              <div className="mt-1 text-sm text-gray-600">
                 {appointmentDetails.service_description}
              </div>
            )}

            {/* Linha 3: Horário Marcado */}
            <div className="mt-2 text-sm text-gray-700">
              <strong>Scheduled Time:</strong> {new Date(appointmentDetails.scheduled_start).toLocaleString()} - {new Date(appointmentDetails.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            {/* Linha 4: Status */}
            <div className="mt-2 text-sm">
              <strong>Status:</strong> <span className={appointmentDetails.status === 'scheduled' ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {appointmentDetails.status}
              </span>
            </div>

            {/* Linha 5: Detalhes do Cliente */}
            {appointmentDetails.client_name && (
              <div className="mt-2 text-sm text-gray-700">
                <strong>Client:</strong> {appointmentDetails.client_name}
              </div>
            )}
            {appointmentDetails.client_email && (
              <div className="mt-1 text-sm text-gray-700">
                <strong>Email:</strong> {appointmentDetails.client_email}
              </div>
            )}
            {appointmentDetails.client_phone && (
              <div className="mt-1 text-sm text-gray-700">
                <strong>Phone:</strong> {appointmentDetails.client_phone}
              </div>
            )}

            {/* Linha 6: Duração e Preço */}
            <div className="mt-2 text-sm text-gray-700">
              <strong>Duration:</strong> {appointmentDetails.service_duration_minutes} minutes
            </div>
            <div className="mt-1 text-sm text-gray-700">
              <strong>Price:</strong> $ {appointmentDetails.service_price.toFixed(2)}
            </div>

           

            {/* Botão de Cancelamento */}
            <div className="mt-4">
              {appointmentDetails.status === 'scheduled' ? ( // Apenas mostrar botão se estiver agendado
                <button
                  onClick={handleCancelAppointment}
                  disabled={isCancelling} // Desabilitar enquanto cancela
                  className={`w-full px-4 py-2 rounded-md shadow-sm text-white font-medium ${
                    isCancelling
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                  }`}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Appointment"}
                </button>
              ) : (
                <p className="text-red-500 text-sm text-center">This appointment is no longer active.</p>
              )}
            </div>
          </div>

          {/* Botão para voltar (opcional) */}
          <div className="mt-4">
            <button
              onClick={() => navigate('/booking/my-appointments')}
              className="w-full px-4 py-2 rounded-md shadow-sm text-white font-medium bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Back to My Appointments
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentDetailsPage;