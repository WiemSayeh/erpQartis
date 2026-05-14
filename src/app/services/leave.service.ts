import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private API = 'http://localhost:8081/api/v1/employee';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getMyInfo(): Observable<any> {
    return this.http.get(`${this.API}/me`, { headers: this.getHeaders() });
  }

  getMyLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/me/leaves`, { headers: this.getHeaders() });
  }

  requestLeave(data: { startDate: string; endDate: string; reason: string }): Observable<any> {
    return this.http.post(`${this.API}/me/leave`, data, { headers: this.getHeaders() });
  }
  getAllLeaves() {
  return this.http.get<any[]>('http://localhost:8081/api/v1/leaves');
}

approveLeave(id: number) {
  return this.http.put(`http://localhost:8081/api/v1/leaves/${id}/approve`, {});
}

rejectLeave(id: number) {
  return this.http.put(`http://localhost:8081/api/v1/leaves/${id}/reject`, {});
}

}
