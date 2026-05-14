import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private apiUrl = 'http://localhost:8081/api/v1/departments';
 constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // GET ALL
  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl, this.getHeaders());
  }

  // GET BY ID
  getById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  // CREATE (ADMIN)
  create(dept: Department): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, dept, this.getHeaders());
  }

  // UPDATE (ADMIN)
  update(id: number, dept: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, dept, this.getHeaders());
  }

  // DELETE (ADMIN)
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
