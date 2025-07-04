// src/app/core/auth/auth.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

interface LoginResponse {
  access_token: string;
}

interface UserProfile {
  userId: string;
  email: string;
  cargoDescricao: string;
  codigoEmpresaId?: string;
}

@Injectable({
  providedIn: 'root' // Mantenha para ser injetável em qualquer lugar
})
export class AuthService {
  private apiUrl = environment.backendAuthUrl;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userProfile = new BehaviorSubject<UserProfile | null>(null);
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.loggedIn = new BehaviorSubject<boolean>(this.isBrowser ? this.hasToken() : false);
    this.userProfile = new BehaviorSubject<UserProfile | null>(null);

    // Carregue o perfil e o token APENAS se estiver no navegador
    if (this.isBrowser && this.hasToken()) {
      this.loadUserProfile();
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUserProfile(): Observable<UserProfile | null> {
    return this.userProfile.asObservable();
  }

  private hasToken(): boolean {
    return this.isBrowser && !!localStorage.getItem('jwt_token');
  }

  private decodeToken(): UserProfile | null {
    if (!this.isBrowser) {
      return null;
    }
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return null;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.sub,
        email: payload.email,
        cargoDescricao: payload.cargoDescricao,
        codigoEmpresaId: payload.codigoEmpresaId,
      };
    } catch (e) {
      console.error('Erro ao decodificar token:', e);
      return null;
    }
  }

  private async loadUserProfile() {
    // Já é chamado dentro de um bloco isBrowser, mas reforça
    if (!this.isBrowser) {
      return;
    }
    const profile = this.decodeToken();
    if (profile) {
      this.userProfile.next(profile);
      this.loggedIn.next(true);
    } else {
      this.logout();
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    // Isso será executado apenas no navegador após a hidratação
    this.notificationService.loading('Realizando login...');
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (this.isBrowser) { // <-- Verificação para localStorage
          localStorage.setItem('jwt_token', response.access_token);
        }
        this.loadUserProfile();
        this.notificationService.closeLoading();
        this.notificationService.success('Sucesso!', 'Login realizado com sucesso!');
        this.router.navigate(['/dashboard']);
      }),
      catchError(error => {
        this.notificationService.closeLoading();
        let errorMessage = 'Erro ao realizar login. Tente novamente.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.notificationService.error('Erro no Login', errorMessage);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) { // <-- Verificação para localStorage
      localStorage.removeItem('jwt_token');
    }
    this.loggedIn.next(false);
    this.userProfile.next(null);
    this.router.navigate(['/auth/login']);
    this.notificationService.success('Sessão Encerrada', 'Você foi desconectado.');
  }

  forgotPassword(email: string): Observable<any> {
    this.notificationService.loading('Enviando e-mail de recuperação...');
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email }).pipe(
      tap(() => {
        this.notificationService.closeLoading();
        this.notificationService.success('E-mail Enviado', 'Verifique sua caixa de entrada para instruções de recuperação de senha.');
      }),
      catchError(error => {
        this.notificationService.closeLoading();
        let errorMessage = 'Erro ao solicitar recuperação de senha.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.notificationService.error('Erro', errorMessage);
        return throwError(() => error);
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    this.notificationService.loading('Redefinindo senha...');
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, newPassword }).pipe(
      tap(() => {
        this.notificationService.closeLoading();
        this.notificationService.success('Senha Redefinida', 'Sua senha foi redefinida com sucesso. Faça login com a nova senha.');
        this.router.navigate(['/auth/login']);
      }),
      catchError(error => {
        this.notificationService.closeLoading();
        let errorMessage = 'Erro ao redefinir senha.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.notificationService.error('Erro', errorMessage);
        return throwError(() => error);
      })
    );
  }
}