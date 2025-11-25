export interface AppointmentSummary {
  id: string;
  service_name: string; // ou service.name se o backend retornar o objeto serviço
  service_type: string; // se necessário
  scheduled_start: string; // ISO string
  scheduled_end: string; // ISO string
  status: string; // ex: "scheduled", "cancelled"
  // ... outros campos relevantes, exceto dados pessoais do cliente
}

export interface ListMyAppointmentsResponse {
  success: boolean;
  message: string;
  appointments: AppointmentSummary[];
  total_count: number;
}
