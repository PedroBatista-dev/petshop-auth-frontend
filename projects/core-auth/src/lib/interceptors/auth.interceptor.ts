// src/app/core/interceptors/auth.interceptor.ts
import {
  HttpRequest,
  HttpHandlerFn, 
  HttpEvent,
  HttpInterceptorFn 
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject, Injector, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../../src/environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const injector = inject(Injector);
  const platformId = injector.get(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  let token: string | null = null;

  // CORREÇÃO AQUI: Acessa localStorage SOMENTE se estiver no navegador
  if (isBrowser) {
    token = localStorage.getItem('jwt_token');
  }

  const isApiUrl = request.url.startsWith(environment.backendAuthUrl);

  if (token && isApiUrl) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request);
};