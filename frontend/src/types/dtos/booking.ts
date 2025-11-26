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
  service_id: string;
  requested_datetime: string;
}

export interface BookAppointmentResponse {
  success: boolean;
  message: string;
  appointment_id?: string;
  view_token?: string;
  cancellation_token?: string;
  error_code?: string;
}

export interface ListAllAppointmentsRequest {
  status?: AppointmentStatus;
  service_type?: ServiceType;
  date_from?: string;
  date_to?: string;
}

export interface AppointmentDetails {
  id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  service_name: string;
  service_description: string;
  service_duration_minutes: number;
  service_price: number;
  service_type: ServiceType;
  scheduled_start: string;
  scheduled_end: string;
  status: AppointmentStatus;
  view_token: string;
  cancellation_token: string;
  created_at: string;
  updated_at: string;
}

export interface ListAllAppointmentsResponse {
  success: boolean;
  message: string;
  appointments: AppointmentDetails[];
  total_count: number;
  error_code?: string;
}
