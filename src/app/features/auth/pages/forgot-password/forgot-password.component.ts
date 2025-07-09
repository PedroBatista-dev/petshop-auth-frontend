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
import { BaseComponent } from '../../../../shared/components/base/base.component';

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
export class ForgotPasswordComponent extends BaseComponent {

  constructor(
    protected override fb: FormBuilder,
    protected override router: Router,
    protected override notificationService: NotificationService,
    protected override authService: AuthService,
  ) {
    super(fb, router, notificationService, authService);
  }

  override onBuildForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Erro no Formulário', 'Por favor, insira um e-mail válido.');
      return;
    }

    this.isLoading = true;
    
    const { email } = this.form.value;

    this.authService.forgotPassword(email).pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.reset();
      })
    ).subscribe({
      next: () => this.onBackToLogin(),
      error: (err) => 
        console.error('Erro ao solicitar recuperação de senha:', err)
    });
  }

}