import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:8081/api/v1/auth/login';
    private BASE_URL = 'http://localhost:8081/api/v1';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(this.API_URL, credentials).pipe(
      tap((response: any) => {

        // ✅ TOKEN
        localStorage.setItem('token', response.token);

        // ✅ ROLE
        localStorage.setItem('role', response.role);

        // ✅ USER COMPLET (si backend le renvoie)
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      })
    );
  }
 private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  signOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('currentUser');

   window.location.href = 'http://localhost:4200/home';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
// Dans ton AuthService
getConnectedEmployeeId(): number | null {
  const user = this.getCurrentUser();
  return user ? user.id : null;
}
  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ADMIN';
  }
   getProfile(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/employee/me`, {
      headers: this.getAuthHeaders()
    });
  }

  isCustomer(): boolean {
    return localStorage.getItem('role') === 'CUSTOMER';
  }

  isEmployee(): boolean {
    return localStorage.getItem('role') === 'EMPLOYEE';
  }
}
