// src/app/core/interceptors/auth.interceptor.ts
import {
  HttpRequest,
  HttpHandlerFn, // Nova interface para interceptors funcionais
  HttpEvent,
  HttpInterceptorFn // Nova interface para interceptors funcionais
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { inject, Injector, PLATFORM_ID } from '@angular/core'; // <-- Importe PLATFORM_ID
import { isPlatformBrowser } from '@angular/common';

// No Angular 18, é comum usar interceptors como funções (functional interceptors)
// Para isso, a assinatura muda.

// Se você QUISER um interceptor como CLASSE (mais parecido com o que tinha antes):
// Você PRECISA usar `provideHttpClient(withInterceptorsFromDi())` no app.config.ts
// E o interceptor continua sendo uma CLASSE com @Injectable() e um método intercept().
/*
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('jwt_token');
    const isApiUrl = request.url.startsWith(environment.backendAuthUrl);
    if (token && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
*/

// VERSÃO RECOMENDADA PARA ANGULAR 18 (Functional Interceptor):
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