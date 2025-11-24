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
