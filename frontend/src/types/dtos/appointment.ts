export interface AppointmentSummary {
  id: string;
  service_name: string;
  service_type: string;
  scheduled_start: string;
  scheduled_end: string;
  status: string;
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
  appointment_id?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  service_name?: string;
  service_description?: string;
  service_duration_minutes?: number;
  service_price?: number;
  service_type?: string;
  scheduled_start?: string;
  scheduled_end?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  error_code?: string;
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
  scheduled_start: string;
  scheduled_end: string;
  status: string;
  created_at: string;
  updated_at: string;
  view_token: string;
  cancellation_token: string;
}
