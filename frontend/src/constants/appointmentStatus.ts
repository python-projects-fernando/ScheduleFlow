import type { AppointmentStatus } from "../types/enums";

export const APPOINTMENT_STATUS_VALUES = [
  "scheduled",
  "completed",
  "cancelled",
  "no_show",
] as const;
