export interface AppointmentSummary {
  id: string;
  service_name: string; // ou service.name se o backend retornar o objeto serviço
  service_type: string; // se necessário
  scheduled_start: string; // ISO string
  scheduled_end: string; // ISO string
  status: string; // ex: "scheduled", "cancelled"
  view_token: string;
  cancellation_token: string;
}

export interface ListMyAppointmentsResponse {
  success: boolean;
  message: string;
  appointments: AppointmentSummary[];
  total_count: number;
}

export interface GetAppointmentDetailsResponse {
  success: boolean;
  message: string;
  appointment_id?: string; // Presente se success for true
  client_name?: string; // Presente se success for true
  client_email?: string; // Presente se success for true
  client_phone?: string; // Presente se success for true
  service_name?: string; // Presente se success for true
  service_description?: string; // Presente se success for true
  service_duration_minutes?: number; // Presente se success for true
  service_price?: number; // Presente se success for true
  service_type?: string; // Presente se success for true
  scheduled_start?: string; // ISO 8601 string, presente se success for true
  scheduled_end?: string; // ISO 8601 string, presente se success for true
  status?: string; // Presente se success for true
  created_at?: string; // ISO 8601 string, presente se success for true
  updated_at?: string; // ISO 8601 string, presente se success for true
  error_code?: string; // Presente se success for false
}

export interface AppointmentDetails {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_name: string;
  service_description: string;
  service_duration_minutes: number;
  service_price: number;
  service_type: string;
  scheduled_start: string; // Pode ser convertido para Date se necessário
  scheduled_end: string; // Pode ser convertido para Date se necessário
  status: string;
  created_at: string; // Pode ser convertido para Date se necessário
  updated_at: string; // Pode ser convertido para Date se necessário
  view_token: string; // Assumindo que o token também seja retornado
  cancellation_token: string; // Assumindo que o token também seja retornado
}
