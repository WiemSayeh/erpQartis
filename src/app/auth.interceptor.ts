import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    // ✅ CRITICAL : Ne JAMAIS cloner une requête FormData
    // Cloner supprime le boundary du Content-Type → MultipartException côté Spring
    if (request.body instanceof FormData) {
      return next.handle(request);
    }

    console.log("INTERCEPTOR TOKEN =", token);

    if (token) {
      const cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    return next.handle(request);
  }
}
