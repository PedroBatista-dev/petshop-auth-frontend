// src/app/shared/services/base/base.service.ts
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../notification.service';
import { Inject, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common';

export abstract class BaseService<T> { 
  protected apiUrl: string; 
  protected isBrowser: boolean;

  constructor(
    protected http: HttpClient,
    protected notificationService: NotificationService,
    protected baseUrl: string,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    this.apiUrl = baseUrl;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido na operação.';

    // CORREÇÃO AQUI: Verifique se está no navegador antes de usar ErrorEvent
    if (this.isBrowser && error.error instanceof ErrorEvent) {
      // Erro do lado do cliente (navegador) ou de rede
      errorMessage = `Erro de Conexão: ${error.error.message}`;
    } else {
      // Erro do lado do servidor ou outros erros que não são ErrorEvent
      if (error.status === 0) {
        // Erro de rede ou CORS que não gerou uma resposta HTTP válida
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão de internet ou tente novamente mais tarde.';
      } else if (error.error && error.error.message) {
        // Erros de validação do NestJS ou mensagens de erro personalizadas do backend
        if (Array.isArray(error.error.message)) {
          errorMessage = error.error.message.join('; '); // Se for um array de mensagens
        } else {
          errorMessage = error.error.message; // Se for uma string simples
        }
      } else {
        errorMessage = `Erro no Servidor: Código ${error.status}, mensagem: ${error.message}`;
        // Opcional: Para debugar erros que não são do tipo ErrorEvent e não tem message no .error
        // console.error('Full server error object:', error);
      }
    }
    this.notificationService.error('Erro na Operação', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Método genérico para requisições GET
  // endpoint: a parte da URL após a apiUrl (ex: 'users', 'products/123')
  // options: HttpHeaders ou outros HttpParams (opcional)
  get<ReturnType = T>(endpoint: string, options?: {
    headers?: HttpHeaders | { [header: string]: string | string[]; };
    observe?: 'body';
    params?: HttpParams | { [param: string]: string | string[]; };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<ReturnType> {
    return this.http.get<ReturnType>(`${this.apiUrl}/${endpoint}`, options).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Método genérico para requisições POST
  // data: o corpo da requisição
  post<ReturnType = T>(endpoint: string, data: any, options?: {
    headers?: HttpHeaders | { [header: string]: string | string[]; };
    observe?: 'body';
    params?: HttpParams | { [param: string]: string | string[]; };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<ReturnType> {
    return this.http.post<ReturnType>(`${this.apiUrl}/${endpoint}`, data, options).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Método genérico para requisições PUT
  // id: o ID do recurso a ser atualizado (se aplicável ao endpoint)
  // data: o corpo da requisição com os dados atualizados
  put<ReturnType = T>(endpoint: string, data: any, options?: {
    headers?: HttpHeaders | { [header: string]: string | string[]; };
    observe?: 'body';
    params?: HttpParams | { [param: string]: string | string[]; };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<ReturnType> {
    return this.http.put<ReturnType>(`${this.apiUrl}/${endpoint}`, data, options).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Método genérico para requisições DELETE
  // id: o ID do recurso a ser deletado
  delete<ReturnType = any>(endpoint: string, options?: { // ReturnType pode ser 'any' ou 'void'
    headers?: HttpHeaders | { [header: string]: string | string[]; };
    observe?: 'body';
    params?: HttpParams | { [param: string]: string | string[]; };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<ReturnType> {
    return this.http.delete<ReturnType>(`${this.apiUrl}/${endpoint}`, options).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}