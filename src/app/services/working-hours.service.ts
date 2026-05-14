import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkingHours } from '../models/WorkingHours.model';
import { WorkShiftResponse } from '../models/work-shift.model';

export interface WorkingHoursCreate {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  departmentId: number;
}

@Injectable({
  providedIn: 'root'
})
export class WorkingHoursService {

  private readonly WH_URL    = 'http://localhost:8081/api/v1/working-hours';
  private readonly SHIFT_URL = 'http://localhost:8081/api/v1/workshifts';

  constructor(private http: HttpClient) {}

  // ── Working Hours ────────────────────────────────────────
  save(employeeId: number, hours: WorkingHoursCreate[]): Observable<any> {
    return this.http.post(`${this.WH_URL}/employee/${employeeId}`, hours);
  }

  getByEmployee(employeeId: number): Observable<WorkingHours[]> {
    return this.http.get<WorkingHours[]>(`${this.WH_URL}/employee/${employeeId}`);
  }

  getAll(): Observable<WorkingHours[]> {
    return this.http.get<WorkingHours[]>(this.WH_URL);
  }

  deleteByEmployee(employeeId: number): Observable<void> {
    return this.http.delete<void>(`${this.WH_URL}/employee/${employeeId}`);
  }

  getByEmail(email: string): Observable<WorkingHours[]> {
    return this.http.get<WorkingHours[]>(`${this.WH_URL}/me`, { params: { email } });
  }

  // ── Work Shifts (admin schedule) ─────────────────────────
  getAllShifts(): Observable<WorkShiftResponse[]> {
    return this.http.get<WorkShiftResponse[]>(this.SHIFT_URL);
  }

  getShiftsByEmployee(employeeId: number): Observable<WorkShiftResponse[]> {
    return this.http.get<WorkShiftResponse[]>(`${this.SHIFT_URL}/employee/${employeeId}`);
  }
}
