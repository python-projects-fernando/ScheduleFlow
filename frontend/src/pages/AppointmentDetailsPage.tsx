import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, post } from '../services/api';
import type { GetAppointmentDetailsResponse, AppointmentDetails } from '../types/dtos/appointment';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';

const AppointmentDetailsPage: React.FC = () => {
  const { viewToken } = useParams<{ viewToken: string }>();
  const navigate = useNavigate();

  const { state: authState } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState<boolean>(false);

  const [showCancellationSuccessModal, setShowCancellationSuccessModal] = useState<boolean>(false);
  const [cancellationSuccessMessage, setCancellationSuccessMessage] = useState<string>("");

  const fetchAppointmentDetails = async () => {
    if (!viewToken) {
      setError("View token is missing.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching appointment details for token:", viewToken);
      const GetAppointmentDetailsResponse = await get(`/booking/details/${viewToken}`);

      if (GetAppointmentDetailsResponse.success && GetAppointmentDetailsResponse.appointment_id) {
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
          view_token: viewToken,
          cancellation_token: GetAppointmentDetailsResponse.cancellation_token || ''
        };
        setAppointmentDetails(mappedDetails);
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

  useEffect(() => {
    fetchAppointmentDetails();
  }, [viewToken]);

  const openCancelConfirmationModal = () => {
    if (appointmentDetails && appointmentDetails.status === 'scheduled') {
      setShowCancelConfirmationModal(true);
    }
  };

  const closeCancelConfirmationModal = () => {
    setShowCancelConfirmationModal(false);
  };

  const confirmCancelAppointment = async () => {
    if (!appointmentDetails) {
      console.error("Cannot cancel, appointment details not loaded.");
      setError("Appointment details not loaded.");
      return;
    }

    const cancelRequest = {
        cancellation_token: appointmentDetails.cancellation_token
    };

    setIsCancelling(true);
    setError(null);
    closeCancelConfirmationModal();

    try {
      console.log("Cancelling appointment with token:", appointmentDetails.cancellation_token);
      const cancelResponse = await post('/booking/cancel', cancelRequest);

      if (cancelResponse.success) {
        console.log("Appointment cancelled successfully!");

        setCancellationSuccessMessage("Appointment cancelled successfully!");
        setShowCancellationSuccessModal(true);

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

  const closeCancellationSuccessModal = () => {
    setShowCancellationSuccessModal(false);
    navigate('/booking/my-appointments');
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

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{appointmentDetails.service_name}</div>
                <div className="text-sm text-gray-600 italic mt-1">{appointmentDetails.service_type}</div>
              </div>
            </div>

            {appointmentDetails.service_description && (
              <div className="mt-1 text-sm text-gray-600">
                 {appointmentDetails.service_description}
              </div>
            )}

            <div className="mt-2 text-sm text-gray-700">
              <strong>Scheduled Time:</strong> {new Date(appointmentDetails.scheduled_start).toLocaleString()} - {new Date(appointmentDetails.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            <div className="mt-2 text-sm">
              <strong>Status:</strong> <span className={appointmentDetails.status === 'scheduled' ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {appointmentDetails.status}
              </span>
            </div>

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

            <div className="mt-2 text-sm text-gray-700">
              <strong>Duration:</strong> {appointmentDetails.service_duration_minutes} minutes
            </div>
            <div className="mt-1 text-sm text-gray-700">
              <strong>Price:</strong> $ {appointmentDetails.service_price.toFixed(2)}
            </div>

            <div className="mt-4">
              {authState.isAuthenticated ? (
                appointmentDetails.status === 'scheduled' ? (
                  <button
                    onClick={openCancelConfirmationModal}
                    disabled={isCancelling}
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
                )
              ) : (
                <p className="text-gray-500 text-sm text-center">
                  Sign in to cancel this appointment.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {showCancelConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Cancellation</h3>
            <div className="text-gray-700 mb-4">
              <p>Are you sure you want to cancel this appointment?</p>
              <p className="font-medium mt-2">{appointmentDetails?.service_name} on {new Date(appointmentDetails?.scheduled_start || '').toLocaleString()}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeCancelConfirmationModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={confirmCancelAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancellationSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Cancelled</h3>
            <div className="text-gray-700 mb-4">
              <p>{cancellationSuccessMessage}</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeCancellationSuccessModal}
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

export default AppointmentDetailsPage;
