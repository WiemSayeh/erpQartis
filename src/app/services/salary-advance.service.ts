import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaryAdvanceService {

  private API = 'http://localhost:8081/api/v1/advances';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
getMyAdvances(employeeId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.API}/my/${employeeId}`, { headers: this.getHeaders() });
}
  requestAdvance(data: { employeeId: number; amount: number }): Observable<any> {
    return this.http.post(this.API, data, { headers: this.getHeaders() });
  }
   getAllAdvances() {
    return this.http.get<any[]>(this.API);
  }

  approveAdvance(id: number) {
    return this.http.put(`${this.API}/${id}/approve`, {});
  }

  rejectAdvance(id: number) {
    return this.http.put(`${this.API}/${id}/reject`, {});
  }
}
