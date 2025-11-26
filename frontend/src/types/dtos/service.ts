import type { ServiceType } from "../enums.ts";

export interface ServiceTypesResponse {
  types: ServiceType[];
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  service_type: ServiceType;
}

export interface CreateServiceResponse {
  success: boolean;
  message: string;
  service_id?: string;
  error_code?: string;
}
