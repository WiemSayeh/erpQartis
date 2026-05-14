import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CinUploadResult {
  frontUrl:      string;
  backUrl:       string;
  cinNumber:     string;
  ocrStatus:     string;
  ocrConfidence: number;
  warning?:      string;
  // ── NOUVEAUX ──
  verified?:     boolean;
  employeeId?: number;
  message?:      string;
  error?:        string;
  fullName?:     string; 
}

@Injectable({ providedIn: 'root' })
export class FileUploadService {

  private readonly API_URL =
    'http://localhost:8081/api/v1/employee-verification/upload';

  uploadCIN(formData: FormData): Observable<CinUploadResult> {
    return new Observable(observer => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.API_URL);
      xhr.onload = () => {
        if (xhr.status === 200) {
          observer.next(JSON.parse(xhr.responseText));
          observer.complete();
        } else {
          observer.error({ status: xhr.status, error: JSON.parse(xhr.responseText) });
        }
      };
      xhr.onerror = () => observer.error({ status: 0, error: 'Network error' });
      xhr.send(formData);
    });
  }
}
