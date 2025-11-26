// frontend/src/pages/AdminServiceManagementPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionamento após cadastro
import Header from '../components/Header';
import Footer from '../components/Footer';
import { post } from '../services/api'; // Usando a função genérica de api.ts
import type { CreateServiceRequest, CreateServiceResponse } from '../types/dtos/service'; // Tipos para criação de serviço
import type { ServiceType } from '../types/enums'; // Importar o enum ServiceType
import { SERVICE_TYPE_VALUES } from '../constants/serviceTypes'; // Importar os valores possíveis

const AdminServiceManagementPage: React.FC = () => {
  const [formData, setFormData] = useState<Omit<CreateServiceRequest, 'service_type'> & { service_type: string }>({ // Inicializa service_type como string vazia
    name: '',
    description: '',
    duration_minutes: 0, // Inicializa com 0
    price: 0, // Inicializa com 0
    service_type: '', // Inicializa com string vazia
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

   const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false); // Estado para controlar a modal de sucesso
   const [successMessage, setSuccessMessage] = useState<string>('');

  const navigate = useNavigate(); // Hook para navegação

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { // Atualiza o handler para lidar com select
    const { name, value } = e.target;

    // Para campos numéricos, converte o valor
    if (name === 'duration_minutes' || name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 })); // Converte para número, ou 0 se inválido
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
      // 1. Preparar o body da requisição
      // Certifique-se de que o tipo seja convertido corretamente para ServiceType
      const requestBody: CreateServiceRequest = {
        name: formData.name,
        description: formData.description,
        duration_minutes: formData.duration_minutes,
        price: formData.price,
        service_type: formData.service_type as ServiceType, // Converte string para enum ServiceType
      };

      console.log("Sending service creation request:", requestBody);

      // 2. Fazer a requisição POST para /admin/services
      const  CreateServiceResponse = await post('/admin/services', requestBody); // Tipa a resposta

      // 3. Tratar a resposta
      if (CreateServiceResponse.success && CreateServiceResponse.service_id) {
        // 4. Cadastro bem-sucedido
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
        // Opcional: Navegar para a lista de serviços ou para outra página
        // navigate('/admin/services/list'); // Exemplo de navegação após criação
      } else {
        // 5. Lidar com falha no cadastro
        console.error("Service creation failed:", CreateServiceResponse);
        setError(CreateServiceResponse.message || "Service creation failed. Please try again.");
      }
    } catch (err) {
      console.error("Network error during service creation:", err);
      // A função 'post' lança um erro, então este catch captura erros de rede ou erros HTTP não ok
      setError(`An error occurred during service creation: ${(err as Error).message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
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
                rows={3} // Define o número de linhas visíveis
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the service..."
              ></textarea> {/* Fechamento explícito do textarea */}
            </div> {/* Fim da div do textarea */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  id="duration_minutes"
                  name="duration_minutes"
                  type="number"
                  min="1" // Garante que a duração seja positiva
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
                  step="0.01" // Permite preços com centavos
                  min="0" // Garante que o preço não seja negativo
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 150.00"
                />
              </div>
            </div>

            {/* --- Campo: Service Type (corrigido para estar fora do textarea) --- */}
            <div>
              <label htmlFor="service_type_select" className="block text-sm font-medium text-gray-700 mb-1">
                Service Type *
              </label>
              <select
                id="service_type_select"
                name="service_type" // O nome do campo deve corresponder à chave em formData
                value={formData.service_type} // O valor do select vem do estado
                onChange={handleChange} // O handler genérico lida com o select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a type...</option>
                {SERVICE_TYPE_VALUES.map((type) => ( // Mapeia os valores constantes
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} {/* Ex: "consultation" -> "Consultation" */}
                  </option>
                ))}
              </select>
            </div>
            {/* --- Fim do Campo: Service Type --- */}

            <div className="pt-4"> {/* Espaçamento superior antes do botão */}
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

          {/* Botão opcional para voltar ao dashboard */}
          <div className="pt-4 text-center">
            <button
              onClick={() => navigate('/admin/dashboard')} // Redireciona para o dashboard
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminServiceManagementPage;