import { Department } from "./employee";

export interface WorkingHours {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  department: Department;
  employeeId: number; // ajoute ça
}
