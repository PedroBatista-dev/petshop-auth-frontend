// src/app/core/auth/auth.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { LoginPayload, LoginResponse, RegisterClientPayload, UserProfile } from './models/auth.model';
import { environment } from '../../../../../src/environments/environment';
import { NotificationService } from '../../../../shared-ui-utils/src/lib/services/notification.service';

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
    private notificationService: NotificationService,
    private router: Router,
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

  login(payload: LoginPayload): Observable<any> {
    this.notificationService.loading('Realizando login...');
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
      tap((response: any) => {
        if (this.isBrowser) { 
          localStorage.setItem('jwt_token', response.access_token);
        }
        this.loadUserProfile();
        this.notificationService.closeLoading();
        this.notificationService.success('Sucesso!', 'Login realizado com sucesso!');
        this.router.navigate(['/dashboard']);
      }),
      catchError((error: any) => {
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
  
  registerUser(payload: RegisterClientPayload): Observable<any> {
    this.notificationService.loading('Registrando usuário...');
    return this.http.post(`${this.apiUrl}/auth/register/cliente`, payload).pipe(
      tap(() => {
        this.notificationService.closeLoading();
        this.notificationService.success('Cadastro Realizado!', 'Seu cadastro foi efetuado com sucesso. Faça login para acessar.');
      }),
      catchError((error: any) => {
        this.notificationService.closeLoading();
        let errorMessage = 'Erro ao registrar usuário.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.notificationService.error('Erro', errorMessage);
        return throwError(() => error);
      })
    );
  }
  
  registerEnterprise(payload: RegisterClientPayload): Observable<any> {
    this.notificationService.loading('Registrando empresa...');
    return this.http.post(`${this.apiUrl}/auth/register/empresa`, payload).pipe(
      tap(() => {
        this.notificationService.closeLoading();
        this.notificationService.success('Cadastro Realizado!', 'Seu cadastro foi efetuado com sucesso.');
      }),
      catchError((error: any) => {
        this.notificationService.closeLoading();
        let errorMessage = 'Erro ao registrar empresa.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.notificationService.error('Erro', errorMessage);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
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
      catchError((error: any) => {
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
      catchError((error: any) => {
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