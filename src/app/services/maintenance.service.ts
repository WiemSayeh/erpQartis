// maintenance-request.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaintenanceRequest } from '../models/maintenanceRequest';
import { Employee } from '../models/employee';

@Injectable({ providedIn: 'root' })
export class MaintenanceRequestService {
  private apiUrl = 'http://localhost:8081/api/v1/maintenance-requests';

  constructor(private http: HttpClient) {}

  // Pour l'ERP : Liste de toutes les demandes
  getAllRequests(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(this.apiUrl);
  }

  // Pour l'ERP : Liste des mécaniciens disponibles
  getAvailableMechanics(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/available-mechanics`);
  }

  // Pour l'ERP : Assigner un mécanicien
  assignMechanic(requestId: number, empId: number): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(`${this.apiUrl}/${requestId}/assign/${empId}`, {});
  }

  // Pour l'ERP & Mobile : Mettre à jour le statut
  updateStatus(requestId: number, status: string): Observable<MaintenanceRequest> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<MaintenanceRequest>(`${this.apiUrl}/${requestId}/status`, {}, { params });
  }
}
