// src/app/features/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RegisterClientComponent } from './pages/register-client/register-client.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterEnterpriseComponent } from './pages/register-enterprise/register-enterprise.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'register-client', component: RegisterClientComponent },
  { path: 'register-enterprise', component: RegisterEnterpriseComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];