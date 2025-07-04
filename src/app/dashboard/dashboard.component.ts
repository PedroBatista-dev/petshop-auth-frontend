// src/app/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngIf, etc.
import { RouterLink } from '@angular/router'; // Para o botão de logout

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importe CommonModule e RouterLink
  template: `
    <div style="text-align:center; margin-top: 50px;">
      <h1>Bem-vindo ao Dashboard!</h1>
      <p>Esta é a rota de outro Micro Frontend (simulado).</p>
      <button routerLink="/auth/login" style="padding: 10px 20px; font-size: 16px;">Logout</button>
    </div>
  `,
  styles: [`
    h1 { color: #3f51b5; }
    button { background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; }
    button:hover { background-color: #d32f2f; }
  `]
})
export class DashboardComponent { }