// frontend/src/application/dtos/GetAvailabilityResponse.ts

// Supondo que você tenha definido ServiceType e AppointmentStatus como enums ou tipos string no frontend também
// Se não tiver, pode usar string literal types ou apenas string para simplificar inicialmente
// Exemplo de enum (se for o caso):
// export enum ServiceType {
//   CONSULTATION = "consultation",
//   FOLLOW_UP = "follow_up",
//   EMERGENCY = "emergency",
//   // ... outros tipos
// }
//
// export enum AppointmentStatus {
//   SCHEDULED = "SCHEDULED",
//   COMPLETED = "COMPLETED",
//   CANCELLED = "CANCELLED",
//   NO_SHOW = "NO_SHOW",
//   // ... outros status
// }

export const SERVICE_TYPE_VALUES = [
  "consultation",
  "follow_up",
  "emergency",
  // ... adicione outros tipos conforme necessário ...
] as const;

export type ServiceType = (typeof SERVICE_TYPE_VALUES)[number];

// Se os tipos forem apenas strings (como no exemplo JSON anterior), pode usar string ou string literals:
// export type ServiceType = "consultation" | "follow_up" | "emergency"; // ou apenas string se quiser mais flexibilidade
export type AppointmentStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"; // ou apenas string

// Definir o tipo para um slot de tempo
export interface TimeSlot {
  start: string; // ISO 8601 string
  end: string; // ISO 8601 string
  is_available: boolean;
}

// Definir o tipo para um serviço disponível
export interface AvailableService {
  id: string;
  name: string;
  description?: string; // Opcional, se puder ser nulo
  duration_minutes: number;
  price?: number; // Opcional, se puder ser nulo
  service_type: ServiceType; // ou string
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
}

// Definir o tipo para a resposta da disponibilidade
export interface GetAvailabilityResponse {
  service_type: ServiceType; // O tipo de serviço solicitado
  time_slots: TimeSlot[]; // Lista de slots e sua disponibilidade
  available_services: AvailableService[]; // Lista de serviços disponíveis para o tipo
}

// Se o backend retornar os tipos de serviço em outro formato, ajuste GetAvailabilityResponse
// Por exemplo, se a resposta for apenas { types: ["consultation", "follow_up", ...] }, então seria:
// export interface GetServiceTypesResponse {
//   types: string[];
// }
