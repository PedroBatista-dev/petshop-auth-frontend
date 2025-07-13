import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../projects/shared-ui-utils/src/lib/components/base/base.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../../../../projects/shared-ui-utils/src/lib/services/notification.service';
import { AuthService } from '../../../../../../projects/core-auth/src/lib/auth/auth.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialImports } from '../../../../../../projects/shared-ui-utils/src/lib/material/material.imports';
import { ControlErrorDisplayDirective } from '../../../../../../projects/shared-ui-utils/src/lib/directives/control-error-display.directive';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    ControlErrorDisplayDirective,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
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
