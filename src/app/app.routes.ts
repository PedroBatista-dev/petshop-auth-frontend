// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { environment } from '../environments/environment';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: environment.authMfeUrl, // URL do Auth MFE
        remoteName: 'authMfe',
        exposedModule: './Routes', // O que o Auth MFE expôs (nome do arquivo de rotas)
      }).then((m) => m.remoteRoutes), // O nome da exportação das rotas
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: environment.financeiroMfeUrl, // URL do Financeiro MFE
        remoteName: 'financeiroMfe',
        exposedModule: './Routes', // O que o Financeiro MFE expôs
      }).then((m) => m.appRoutes), // O nome da exportação das rotas
  },
  { path: '**', redirectTo: 'auth' },
];