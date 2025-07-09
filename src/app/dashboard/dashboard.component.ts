// src/app/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialImports } from '../shared/material/material.imports';
import { AuthService } from '../core/auth/auth.service';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule,
      ReactiveFormsModule,
      ...MaterialImports,],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent { 
  constructor(
    private authService: AuthService,
  ) {
  }

  sair(): void {
    this.authService.logout();
  }
}