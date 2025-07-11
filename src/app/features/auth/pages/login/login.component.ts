// src/app/features/auth/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

import { MaterialImports } from '../../../../shared/material/material.imports';
import { AuthService } from '../../../../core/auth/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { finalize } from 'rxjs/operators';
import { ControlErrorDisplayDirective } from '../../../../shared/directives/control-error-display.directive';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { LoginPayload } from '../../../../core/auth/models/auth.model';

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ...MaterialImports,
        ControlErrorDisplayDirective,
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent {

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  override onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Erro no Formulário', 'Por favor, preencha todos os campos corretamente.');
      this.markAllFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;

    const payload = new LoginPayload(this.form.value);
    this.authService.login(payload).pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.reset();
      })
    ).subscribe({
      next: (response) => console.log('Login bem-sucedido:', 'Bem-vindo(a) ao PetConnect!'),
      error: (err) => console.error('Erro durante o login:', err)
    });
  }

  onForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  onRegisterClient(): void {
    this.router.navigate(['/auth/register-client']);
  }
  
  onRegisterEnterprise(): void {
    this.router.navigate(['/auth/register-enterprise']);
  }
}