import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { EmployeeCreate } from '../models/employee-create';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  // Ton URL de base pour les employés
  private apiUrl = 'http://localhost:8081/api/v1/admin/employees';

  constructor(private http: HttpClient) {}

  // 1. Récupérer tous les employés
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl, { withCredentials: true });
  }

  // 2. Récupérer UN employé par son ID (pour le mode édition)
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // 3. Créer un employé (POST)
  createEmployee(employee: EmployeeCreate): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee, { withCredentials: true });
  }

  // 4. Modifier un employé (PUT)
  updateEmployee(id: number, employee: any): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee, { withCredentials: true });
  }

  // 5. Supprimer un employé (DELETE)
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
