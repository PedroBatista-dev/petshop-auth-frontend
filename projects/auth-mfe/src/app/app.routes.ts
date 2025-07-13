import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RegisterClientComponent } from './pages/register-client/register-client.component';
import { RegisterEnterpriseComponent } from './pages/register-enterprise/register-enterprise.component';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [noAuthGuard] },
    { path: 'reset-password', component: ResetPasswordComponent, canActivate: [noAuthGuard] },
    { path: 'register-client', component: RegisterClientComponent, canActivate: [noAuthGuard] },
    { path: 'register-enterprise', component: RegisterEnterpriseComponent, canActivate: [noAuthGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
