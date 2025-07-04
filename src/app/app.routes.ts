// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES) // Carrega as rotas filhas do MFE de autenticação
  },
  {
    // Esta rota simula o shell redirecionando para um componente de outro MFE.
    // Em um setup real de MFE, 'dashboard' poderia ser um sub-projeto carregado por Module Federation.
    // Por enquanto, é um componente "dummy" para mostrar o redirecionamento.
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) // Vamos criar este componente dummy
  },
  { path: '**', redirectTo: 'auth' } // Redireciona rotas não encontradas para o login
];