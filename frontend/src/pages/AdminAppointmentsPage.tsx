import React, { useState, useEffect } from 'react';
import { get, del } from '../services/api';
import type { ListAllAppointmentsRequest, ListAllAppointmentsResponse, AppointmentDetails } from '../types/dtos/booking';
import type { AppointmentStatus, ServiceType } from '../types/enums';
import { SERVICE_TYPE_VALUES } from '../constants/serviceTypes';
import { APPOINTMENT_STATUS_VALUES } from '../constants/appointmentStatus';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

const AdminAppointmentsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentDetails[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  type FilterState = Omit<ListAllAppointmentsRequest, 'date_from' | 'date_to'> & {
    date_from: string;
    date_to: string;
  };

  const [filters, setFilters] = useState<FilterState>({
    status: undefined,
    service_type: undefined,
    date_from: '',
    date_to: '',
  });

  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState<boolean>(false);
  const [cancellationTokenToUse, setCancelationTokenToUse] = useState<string | null>(null);

  const [showCancellationSuccessModal, setShowCancellationSuccessModal] = useState<boolean>(false);
  const [cancellationSuccessMessage, setCancellationSuccessMessage] = useState<string>("");

  const fetchAppointments = async (requestFilters: Omit<ListAllAppointmentsRequest, 'date_from' | 'date_to'> & { date_from?: Date; date_to?: Date }) => {
    try {
      console.log("Fetching appointments with filters:", requestFilters);

      const queryParams = new URLSearchParams();
      if (requestFilters.status) queryParams.append('status', requestFilters.status);
      if (requestFilters.service_type) queryParams.append('service_type', requestFilters.service_type);
      if (requestFilters.date_from) queryParams.append('date_from', requestFilters.date_from.toISOString());
      if (requestFilters.date_to) queryParams.append('date_to', requestFilters.date_to.toISOString());

      const queryString = queryParams.toString();
      const endpoint = `/admin/appointments${queryString ? '?' + queryString : ''}`;

      console.log("Fetching from endpoint:", endpoint);

      const ListAllAppointmentsResponse = await get(endpoint);

      if (ListAllAppointmentsResponse.success) {
        setAppointments(ListAllAppointmentsResponse.appointments || []);
        setTotalCount(ListAllAppointmentsResponse.total_count || 0);
        console.log("Appointments fetched successfully:", ListAllAppointmentsResponse);
      } else {
        console.error("Failed to fetch appointments:", ListAllAppointmentsResponse);
        setError(ListAllAppointmentsResponse.message || "Failed to fetch appointments.");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(`An error occurred while fetching appointments: ${(err as Error).message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialRequest: Omit<ListAllAppointmentsRequest, 'date_from' | 'date_to'> & { date_from?: Date; date_to?: Date } = {};
    fetchAppointments(initialRequest);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAppointments([]);
    setTotalCount(0);

    const requestFilters: Omit<ListAllAppointmentsRequest, 'date_from' | 'date_to'> & { date_from?: Date; date_to?: Date } = {
      status: filters.status || undefined,
      service_type: filters.service_type || undefined,
      date_from: filters.date_from ? new Date(filters.date_from) : undefined,
      date_to: filters.date_to ? new Date(filters.date_to) : undefined,
    };

    fetchAppointments(requestFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      status: undefined,
      service_type: undefined,
      date_from: '',
      date_to: '',
    });
    setLoading(true);
    setError(null);
    setAppointments([]);
    setTotalCount(0);

    const emptyFiltersRequest: Omit<ListAllAppointmentsRequest, 'date_from' | 'date_to'> & { date_from?: Date; date_to?: Date } = {};

    fetchAppointments(emptyFiltersRequest);
  };

  const openCancelConfirmationModal = (cancellationToken: string) => {
    setCancelationTokenToUse(cancellationToken);
    setShowCancelConfirmationModal(true);
  };

  const closeCancelConfirmationModal = () => {
    setShowCancelConfirmationModal(false);
    setCancelationTokenToUse(null);
  };

  const confirmCancelAppointment = async () => {
    if (!cancellationTokenToUse) {
      console.error("No cancellation token provided for cancellation.");
      setError("No cancellation token provided.");
      return;
    }

    closeCancelConfirmationModal();
    setLoading(true);

    try {
      console.log("Cancelling appointment via magic link with token:", cancellationTokenToUse);
      const cancelResponse = await del(`/booking/cancel-by-token/${encodeURIComponent(cancellationTokenToUse)}`);

      if (cancelResponse.success) {
        console.log("Appointment cancelled successfully via magic link!");
        setCancellationSuccessMessage("Appointment cancelled successfully!");
        setShowCancellationSuccessModal(true);

        setAppointments(prev => prev.filter(appt => appt.cancellation_token !== cancellationTokenToUse));
        setTotalCount(prev => Math.max(0, prev - 1));
      } else {
        console.error("Failed to cancel appointment via magic link:", cancelResponse);
        setError(cancelResponse.message || "Failed to cancel appointment.");
      }
    } catch (err) {
      console.error("Error cancelling appointment via magic link:", err);
      setError(`An error occurred while cancelling: ${(err as Error).message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const closeCancellationSuccessModal = () => {
    setShowCancellationSuccessModal(false);
    setCancellationSuccessMessage('');
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <AdminHeader />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Loading appointments...</p>
        </div>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <AdminHeader />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Appointments</h2>

          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="statusFilter"
                    name="status"
                    value={filters.status || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as AppointmentStatus || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    {APPOINTMENT_STATUS_VALUES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="serviceTypeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type
                  </label>
                  <select
                    id="serviceTypeFilter"
                    name="service_type"
                    value={filters.service_type || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, service_type: e.target.value as ServiceType || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    {SERVICE_TYPE_VALUES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="dateFromFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="datetime-local"
                    id="dateFromFilter"
                    name="date_from"
                    value={filters.date_from}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="dateToFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="datetime-local"
                    id="dateToFilter"
                    name="date_to"
                    value={filters.date_to}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Reset Filters
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheduled Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        No appointments found matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{appointment.service_name}</div>
                          <div className="text-sm text-gray-500">{appointment.service_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.client_name}</div>
                          <div className="text-sm text-gray-500">{appointment.client_email}</div>
                          {appointment.client_phone && <div className="text-sm text-gray-500">{appointment.client_phone}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(appointment.scheduled_start).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            to {new Date(appointment.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status.toLowerCase() === 'scheduled' ? 'bg-green-100 text-green-800' :
                            appointment.status.toLowerCase() === 'completed' ? 'bg-blue-100 text-blue-800' :
                            appointment.status.toLowerCase() === 'cancelled' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status.toLowerCase() === 'no_show' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                           <button
                             onClick={() => openCancelConfirmationModal(appointment.cancellation_token)}
                             disabled={appointment.status.toLowerCase() !== 'scheduled'}
                             className={`${
                               appointment.status.toLowerCase() === 'scheduled'
                                 ? 'text-red-600 hover:text-red-900'
                                 : 'text-gray-400 cursor-not-allowed'
                             }`}
                             title={appointment.status.toLowerCase() === 'scheduled' ? "Cancel Appointment (Magic Link)" : "Cannot cancel, status is not scheduled"}
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                             </svg>
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{appointments.length}</span> of{' '}
                <span className="font-medium">{totalCount}</span> results
              </div>
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
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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

      <AdminFooter />
    </div>
  );
};

export default AdminAppointmentsPage;
