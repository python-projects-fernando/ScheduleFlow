// frontend/src/pages/PublicCancellationPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, del } from '../services/api'; // Assumindo que você tenha uma função 'del' ou 'post' para DELETE
import Header from '../components/Header';

const PublicCancellationPage: React.FC = () => {
  const { cancellationToken } = useParams<{ cancellationToken: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Verifica o token e carrega dados iniciais (se necessário, mas aqui só confirmamos o token)
  useEffect(() => {
    if (!cancellationToken) {
      setError("Cancellation token is missing.");
      setLoading(false);
    } else {
      // Token presente, pode carregar mais dados ou simplesmente aguardar a confirmação
      // Por exemplo, poderia tentar buscar detalhes do agendamento com o view_token se tivesse,
      // mas para cancelamento, o token é suficiente.
      setLoading(false);
    }
  }, [cancellationToken]);

  const openConfirmationModal = () => {
    if (cancellationToken) {
      setShowConfirmationModal(true);
    }
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const confirmCancel = async () => {
    if (!cancellationToken) {
      console.error("Cannot cancel, cancellation token not loaded.");
      setError("Cancellation token not loaded.");
      return;
    }

    closeConfirmationModal(); // Fecha a modal de confirmação antes de tentar cancelar
    setLoading(true);
    setError(null);

    try {
      console.log("Cancelling appointment with token:", cancellationToken);
      // Chamada para o endpoint DELETE /api/booking/cancel-by-token/{cancellation_token}
      // A função 'del' deve ser definida em services/api.ts para lidar com DELETE
      // Exemplo de como 'del' pode ser definido em api.ts (similar ao post/get):
      /*
      export const del = (endpoint: string, options?: RequestInit) =>
        apiRequest(endpoint, { ...options, method: "DELETE" });
      */
      const response = await del(`/booking/cancel-by-token/${encodeURIComponent(cancellationToken)}`);

      if (response.success) {
        console.log("Appointment cancelled successfully via magic link!");
        setSuccessMessage("Appointment cancelled successfully!");
        setShowSuccessModal(true);
      } else {
        console.error("Failed to cancel appointment via magic link:", response);
        setError(response.message || "Failed to cancel appointment.");
      }
    } catch (err) {
      console.error("Error cancelling appointment via magic link:", err);
      setError(`An error occurred while cancelling: ${(err as Error).message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Opcional: Navegar para home ou outra página após fechar
    navigate('/'); // Exemplo: navegar para a homepage
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Cancel Appointment</h2>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-700 mb-4">
              You are about to cancel an appointment using a secure link.
            </p>
            <p className="text-gray-700 mb-6">
              Please click the button below to proceed with the cancellation.
            </p>

            <button
              onClick={openConfirmationModal}
              disabled={showConfirmationModal || showSuccessModal} // Desabilita se modais estão abertas
              className={`w-full px-4 py-2 rounded-md shadow-sm text-white font-medium ${
                showConfirmationModal || showSuccessModal
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              }`}
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </main>

      {/* --- Modal de Confirmação --- */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Cancellation</h3>
            <div className="text-gray-700 mb-4">
              <p>Are you sure you want to cancel this appointment?</p>
              {/* Não inclui detalhes do agendamento aqui, pois o usuário já os viu no email */}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeConfirmationModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal de Sucesso --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Cancelled</h3>
            <div className="text-gray-700 mb-4">
              <p>{successMessage}</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeSuccessModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicCancellationPage;