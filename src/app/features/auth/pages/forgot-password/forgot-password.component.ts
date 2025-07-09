// src/app/features/auth/pages/forgot-password/forgot-password.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MaterialImports } from '../../../../shared/material/material.imports';
import { AuthService } from '../../../../core/auth/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { finalize } from 'rxjs/operators';
import { ControlErrorDisplayDirective } from '../../../../shared/directives/control-error-display.directive';

@Component({
    selector: 'app-forgot-password',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ...MaterialImports,
        ControlErrorDisplayDirective,
    ],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.notificationService.error('Erro no Formulário', 'Por favor, insira um e-mail válido.');
      return;
    }

    this.isLoading = true;
    const { email } = this.forgotPasswordForm.value;

    this.authService.forgotPassword(email).pipe(
      finalize(() => {
        this.isLoading = false;
        this.forgotPasswordForm.reset();
      })
    ).subscribe({
      next: () => {
        // A mensagem de sucesso já é tratada no AuthService
        this.router.navigate(['/auth/login']); // Redireciona para o login ou instrui a verificar o email
      },
      error: (err) => {
        // Mensagem de erro já tratada no AuthService
        console.error('Erro ao solicitar recuperação de senha:', err);
      }
    });
  }

  onBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}