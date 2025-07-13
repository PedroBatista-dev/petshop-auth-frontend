import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../projects/shared-ui-utils/src/lib/components/base/base.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports } from '../../../../../../projects/shared-ui-utils/src/lib/material/material.imports';
import { NgxMaskDirective } from 'ngx-mask';
import { ControlErrorDisplayDirective } from '../../../../../../projects/shared-ui-utils/src/lib/directives/control-error-display.directive';
import { PrimeiraLetraMaiusculaDirective } from '../../../../../../projects/shared-ui-utils/src/lib/directives/first-capital-letter.directive';
import { AutoFocusDirective } from '../../../../../../projects/shared-ui-utils/src/lib/directives/auto-focus.directive';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../../../projects/shared-ui-utils/src/lib/services/notification.service';
import { AuthService } from '../../../../../../projects/core-auth/src/lib/auth/auth.service';
import { RegisterClientPayload } from '../../../../../../projects/core-auth/src/lib/auth/models/auth.model';
import { finalize } from 'rxjs';
import { cnpjValidator } from '../../../../../../projects/shared-ui-utils/src/lib/validators/cnpj.validator';
import { telefoneValidator } from '../../../../../../projects/shared-ui-utils/src/lib/validators/telefone.validator';

@Component({
  selector: 'app-register-enterprise',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    NgxMaskDirective,
    ControlErrorDisplayDirective,
    PrimeiraLetraMaiusculaDirective,
    AutoFocusDirective,
  ],
  templateUrl: './register-enterprise.component.html',
  styleUrl: './register-enterprise.component.scss'
})
export class RegisterEnterpriseComponent extends BaseComponent {

  passwordStrength = 0; 
  passwordStrengthText = 'Nenhuma';
  passwordStrengthColor = 'warn';

  hidePassword = true;
  hideConfirmPassword = true;

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
      razaoSocial: ['', [Validators.required, Validators.minLength(3)]],
      descricaoEmpresa: ['', [Validators.required, Validators.minLength(3)]],
      cnpj: ['', [Validators.required, cnpjValidator()]],
      telefone: ['', [Validators.required, telefoneValidator()]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  override onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Erro no Formulário', 'Por favor, preencha todos os campos corretamente.');
      this.markAllFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;

    const { confirmPassword, ...formDataWithoutConfirmPassword } = this.form.value;

    const payload = new RegisterClientPayload(formDataWithoutConfirmPassword);

    this.authService.registerEnterprise(payload).pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.reset();
      })
    ).subscribe({
      next: () => this.onBackToLogin(),
      error: (err) => 
        console.error('Erro ao registrar empresa:', err)
    });
  }
}
