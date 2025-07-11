// src/app/features/auth/pages/register-client/register-client.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MaterialImports } from '../../../../shared/material/material.imports';
import { NgxMaskDirective } from 'ngx-mask';
import { NotificationService } from '../../../../shared/services/notification.service';
import { debounceTime, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; 
import { ControlErrorDisplayDirective } from '../../../../shared/directives/control-error-display.directive';
import { PrimeiraLetraMaiusculaDirective } from '../../../../shared/directives/first-capital-letter.directive';
import { AutoFocusDirective } from '../../../../shared/directives/auto-focus.directive';
import { telefoneValidator } from '../../../../shared/validators/telefone.validator';
import { strongPasswordValidator } from '../../../../shared/validators/strong-password.validator';
import zxcvbn from 'zxcvbn';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { RegisterClientPayload } from '../../../../core/auth/models/auth.model';
import { matchPasswordsValidator } from '../../../../shared/validators/match-passwords.validator';
import { cnpjValidator } from '../../../../shared/validators/cnpj.validator';

@Component({
    selector: 'app-register-client',
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
    styleUrls: ['./register-enterprise.component.scss']
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
    private http: HttpClient 
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