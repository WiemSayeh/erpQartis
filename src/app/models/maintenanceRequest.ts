import { MaintenanceStatus } from "./maintenanceStatus";


export interface MaintenanceRequest {
  id: number;
  requestDate: string;           // ISO string du backend
 status: MaintenanceStatus;

  // Infos client & voiture
  customerFullName: string;
  customerPhone: string;
  carBrandModel: string;

  // Infos service
  serviceName: string;

  // Infos employé assigné
  employeeId?: number;
  employeeFullName?: string;
}
