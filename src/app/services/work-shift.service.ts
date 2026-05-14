import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkShift } from '../models/WorkShift';

@Injectable({
  providedIn: 'root'
})
export class WorkShiftService {
  private readonly API_URL = 'http://localhost:8081/api/v1/workshifts';

  constructor(private http: HttpClient) {}

  getAllShifts(): Observable<WorkShift[]> {
    return this.http.get<WorkShift[]>(this.API_URL);
  }

  autoAssign(deptId: number, dto: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auto-assign/${deptId}`, dto);
  }

  createShift(shift: any): Observable<WorkShift> {
    return this.http.post<WorkShift>(this.API_URL, shift);
  }


getMyShifts(): Observable<WorkShift[]> {
  return this.http.get<WorkShift[]>(`${this.API_URL}/me`);
  // L'interceptor envoie le token automatiquement ✅
}
}
