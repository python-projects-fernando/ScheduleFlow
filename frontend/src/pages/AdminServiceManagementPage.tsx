import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../services/api';
import type { CreateServiceRequest, CreateServiceResponse } from '../types/dtos/service';
import type { ServiceType } from '../types/enums';
import { SERVICE_TYPE_VALUES } from '../constants/serviceTypes';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

const AdminServiceManagementPage: React.FC = () => {
  const [formData, setFormData] = useState<Omit<CreateServiceRequest, 'service_type'> & { service_type: string }>({
    name: '',
    description: '',
    duration_minutes: 0,
    price: 0,
    service_type: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'duration_minutes' || name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestBody: CreateServiceRequest = {
        name: formData.name,
        description: formData.description,
        duration_minutes: formData.duration_minutes,
        price: formData.price,
        service_type: formData.service_type as ServiceType,
      };

      console.log("Sending service creation request:", requestBody);

      const CreateServiceResponse = await post('/admin/services', requestBody);

      if (CreateServiceResponse.success && CreateServiceResponse.service_id) {
        console.log("Service created successfully:", CreateServiceResponse);
        setSuccessMessage(`Service "${formData.name}" created successfully with ID: ${CreateServiceResponse.service_id}`);
        setShowSuccessModal(true);
        setFormData({
          name: '',
          description: '',
          duration_minutes: 0,
          price: 0,
          service_type: ''
        });
      } else {
        console.error("Service creation failed:", CreateServiceResponse);
        setError(CreateServiceResponse.message || "Service creation failed. Please try again.");
      }
    } catch (err) {
      console.error("Network error during service creation:", err);
      setError(`An error occurred during service creation: ${(err as Error).message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <AdminHeader />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full bg-white shadow-xl rounded-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Register New Service</h1>
            <p className="mt-2 text-gray-600">Add a new service to the system.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Service Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Cardiology Consultation"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the service..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  id="duration_minutes"
                  name="duration_minutes"
                  type="number"
                  min="1"
                  required
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 60"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 150.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="service_type_select" className="block text-sm font-medium text-gray-700 mb-1">
                Service Type *
              </label>
              <select
                id="service_type_select"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a type...</option>
                {SERVICE_TYPE_VALUES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {loading ? 'Creating Service...' : 'Create Service'}
              </button>
            </div>
          </form>

          <div className="pt-4 text-center">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Back to Admin Dashboard
            </button>
          </div>
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Created</h3>
            <div className="text-gray-700 mb-4">
              <p>{successMessage}</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeSuccessModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

export default AdminServiceManagementPage;
