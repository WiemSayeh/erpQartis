
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8081/api/v1/admin/stocks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  adjustQuantity(id: number, amount: number): Observable<void> {
    const params = new HttpParams().set('amount', amount.toString());
    return this.http.patch<void>(`${this.apiUrl}/${id}/adjust`, null, {
      params,
      withCredentials: true
    });
  }
}
