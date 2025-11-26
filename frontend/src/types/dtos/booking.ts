import type { ServiceType } from "../enums";
import type { AppointmentStatus } from "../enums";

export interface TimeSlot {
  start: string;
  end: string;
  is_available: boolean;
}

export interface AvailableService {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  service_type: ServiceType;
  created_at: string;
  updated_at: string;
}

export interface GetAvailabilityResponse {
  service_type: ServiceType;
  time_slots: TimeSlot[];
  available_services: AvailableService[];
}

export interface BookAppointmentRequest {
  service_id: string; // O ID do serviço selecionado
  requested_datetime: string; // A data e hora solicitada no formato ISO 8601 (ex: "2025-11-24T07:00:00.000Z")
  // Nota: client_name, client_email, client_phone não são mais enviados aqui,
  // pois serão obtidos do usuário autenticado no backend.
}

export interface BookAppointmentResponse {
  success: boolean;
  message: string;
  appointment_id?: string; // Presente se success for true
  view_token?: string; // Presente se success for true
  cancellation_token?: string; // Presente se success for true
  error_code?: string; // Presente se success for false
}

export interface ListAllAppointmentsRequest {
  status?: AppointmentStatus; // Filtrar por status (opcional)
  service_type?: ServiceType; // Filtrar por tipo de serviço (opcional)
  date_from?: string; // Filtrar por data/hora inicial (ISO string, opcional) - Vem do frontend como Date e é convertido para ISO na requisição
  date_to?: string; // Filtrar por data/hora final (ISO string, opcional) - Vem do frontend como Date e é convertido para ISO na requisição
}

// --- DTO para um Agendamento na Lista (Resumo para Admin) ---
// Corresponde ao AdminAppointmentSummaryDTO do backend
export interface AppointmentDetails {
  // ou AdminAppointmentSummary
  id: string;
  client_name: string;
  client_email: string;
  client_phone?: string; // Opcional, pode não estar presente
  service_name: string;
  service_description: string;
  service_duration_minutes: number;
  service_price: number;
  service_type: ServiceType; // Usando o enum
  scheduled_start: string; // ISO string
  scheduled_end: string; // ISO string
  status: AppointmentStatus; // Usando o enum
  view_token: string;
  cancellation_token: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

// --- DTO para a Resposta da Listagem ---
// Corresponde ao ListAllAppointmentsResponse do backend
export interface ListAllAppointmentsResponse {
  success: boolean;
  message: string;
  appointments: AppointmentDetails[]; // Lista de resumos
  total_count: number; // Total de agendamentos encontrados (antes da paginação, se houver)
  error_code?: string; // Presente se success for false
}
