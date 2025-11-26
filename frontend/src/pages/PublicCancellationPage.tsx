import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { del } from '../services/api';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';

const PublicCancellationPage: React.FC = () => {
  const { cancellationToken } = useParams<{ cancellationToken: string }>();
  const navigate = useNavigate();
  const { state: authState } = useAuth();

  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  const performCancellation = async () => {
    if (!cancellationToken) {
      setError("Cancellation token is missing.");
      return;
    }

    setIsCancelling(true);
    setError(null);
    setSuccessMessage('');

    try {
      console.log("Cancelling appointment with token:", cancellationToken);
      const  CancelByTokenResponse = await del(`/booking/cancel-by-token/${encodeURIComponent(cancellationToken)}`);

      if (CancelByTokenResponse.success) {
        console.log("Appointment cancelled successfully via magic link!");
        setSuccessMessage(CancelByTokenResponse.message || "Appointment cancelled successfully!");
      } else {
        console.error("Failed to cancel appointment via magic link:", CancelByTokenResponse);
        setError(CancelByTokenResponse.message || "Failed to cancel appointment.");
      }
    } catch (err) {
      console.error("Error cancelling appointment via magic link:", err);
      setError(`An error occurred while cancelling: ${(err as Error).message || "Unknown error"}`);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleConfirmCancel = () => {
    closeConfirmationModal();
    performCancellation();
  };

  const openConfirmationModal = () => {
    if (authState.isAuthenticated) {
      if (authState.role === 'admin' || authState.role === 'user') {
        setShowConfirmationModal(true);
      } else {
        setError("Unauthorized: Invalid user role.");
      }
    } else {
      setShowConfirmationModal(true);
    }
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  if (isCancelling) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Processing cancellation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Cancel Appointment</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {!successMessage && !error && (
            <div>
              <p className="text-gray-700 mb-4">
                You are accessing a secure cancellation link. Please confirm to proceed.
              </p>
              <button
                onClick={openConfirmationModal}
                disabled={showConfirmationModal}
                className={`w-full px-4 py-2 rounded-md shadow-sm text-white font-medium ${
                  showConfirmationModal
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
              >
                {showConfirmationModal ? "Confirming..." : "Confirm Cancellation"}
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mt-4">
              <button
                onClick={() => navigate('/')}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Go Home
              </button>
            </div>
          )}
        </div>
      </main>

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Cancellation</h3>
            <div className="text-gray-700 mb-4">
              <p>Are you sure you want to cancel this appointment? This action cannot be undone.</p>
              {authState.isAuthenticated && (
                <p className="mt-2 text-sm text-gray-600">
                  You are logged in as a <strong>{authState.role}</strong>.
                </p>
              )}
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
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicCancellationPage;
