
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceServiceDTO } from '../models/maintenanceServiceDTO';




@Injectable({
  providedIn: 'root'
})
export class MaintenanceServiceService {

  private apiUrl = 'http://localhost:8081/api/v1/maintenance-services';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MaintenanceServiceDTO[]> {
    return this.http.get<MaintenanceServiceDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<MaintenanceServiceDTO> {
    return this.http.get<MaintenanceServiceDTO>(`${this.apiUrl}/${id}`);
  }

  create(service: MaintenanceServiceDTO): Observable<MaintenanceServiceDTO> {
    return this.http.post<MaintenanceServiceDTO>(this.apiUrl, service);
  }

  update(service: MaintenanceServiceDTO): Observable<MaintenanceServiceDTO> {
    return this.http.post<MaintenanceServiceDTO>(this.apiUrl, service); // même endpoint que backend
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
