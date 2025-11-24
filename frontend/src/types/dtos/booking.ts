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
