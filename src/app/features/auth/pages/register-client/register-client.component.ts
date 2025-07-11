// src/app/features/auth/pages/register-client/register-client.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MaterialImports } from '../../../../shared/material/material.imports';
import { NgxMaskDirective } from 'ngx-mask';
import { NotificationService } from '../../../../shared/services/notification.service';
import { debounceTime, finalize } from 'rxjs/operators';
import { cpfValidator } from '../../../../shared/validators/cpf.validator';
import { ControlErrorDisplayDirective } from '../../../../shared/directives/control-error-display.directive';
import { PrimeiraLetraMaiusculaDirective } from '../../../../shared/directives/first-capital-letter.directive';
import { AutoFocusDirective } from '../../../../shared/directives/auto-focus.directive';
import { telefoneValidator } from '../../../../shared/validators/telefone.validator';
import { strongPasswordValidator } from '../../../../shared/validators/strong-password.validator';
import zxcvbn from 'zxcvbn';
import { dateFormatValidator } from '../../../../shared/validators/date-format.validator';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { RegisterClientPayload } from '../../../../core/auth/models/auth.model';
import { matchPasswordsValidator } from '../../../../shared/validators/match-passwords.validator';
import { Empresa } from '../../../../shared/models/empresa.model';
import { Observable } from 'rxjs';
import { EmpresaService } from '../../../../shared/services/empresa/empresa.service';
import { GenericAutocompleteComponent, AutocompleteItem } from '../../../../shared/components/generic-autocomplete/generic-autocomplete.component';

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
        GenericAutocompleteComponent
    ],
    templateUrl: './register-client.component.html',
    styleUrls: ['./register-client.component.scss']
})
export class RegisterClientComponent extends BaseComponent {
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
    public empresaService: EmpresaService,
  ) {
    super(fb, router, notificationService, authService);
    
  }

  override onBuildForm(): void {
    this.form = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, cpfValidator()]],
      dataNascimento: ['', [Validators.required, dateFormatValidator()]], 
      sexo: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      telefone: ['', [Validators.required, telefoneValidator()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]],
      empresaAutocomplete: ['', [Validators.required]],
      codigoEmpresaId: [''],
    },
    {
      validators: [
        matchPasswordsValidator('password', 'confirmPassword')
      ]
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    // Observa as mudanças no campo 'password' para calcular a força
    this.form.get('password')?.valueChanges
      .pipe(
        debounceTime(300) // Espera 300ms para o usuário parar de digitar
      )
      .subscribe(password => {
        if (password) {
          const result = zxcvbn(password);
          this.passwordStrength = (result.score + 1) * 20; // Pontuação de 0-4 mapeada para 0-100 (passos de 20%)
          this.updatePasswordStrengthText(result.score);
        } else {
          this.passwordStrength = 0;
          this.passwordStrengthText = 'Nenhuma';
          this.passwordStrengthColor = 'warn';
        }
      });
  }

  onEmpresaSelected(selectedItem: AutocompleteItem): void {
    this.form.get('codigoEmpresaId')?.setValue(selectedItem.id); 
  }

  private updatePasswordStrengthText(score: number): void {
    switch (score) {
      case 0:
        this.passwordStrengthText = 'Muito Fraca';
        this.passwordStrengthColor = 'warn';
        break;
      case 1:
        this.passwordStrengthText = 'Fraca';
        this.passwordStrengthColor = 'warn';
        break;
      case 2:
        this.passwordStrengthText = 'Média';
        this.passwordStrengthColor = 'accent';
        break;
      case 3:
        this.passwordStrengthText = 'Boa';
        this.passwordStrengthColor = 'primary';
        break;
      case 4:
        this.passwordStrengthText = 'Excelente';
        this.passwordStrengthColor = 'primary';
        break;
      default:
        this.passwordStrengthText = 'Nenhuma';
        this.passwordStrengthColor = 'warn';
    }
  }

  override onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Erro no Formulário', 'Por favor, preencha todos os campos corretamente.');
      this.markAllFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;

    this.formatDate('dataNascimento');

    const { confirmPassword, empresaAutocomplete, ...formData } = this.form.value;

    const payload = new RegisterClientPayload(formData);

    this.authService.registerUser(payload).pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.reset();
      })
    ).subscribe({
      next: () => this.onBackToLogin(),
      error: (err) => 
        console.error('Erro ao registrar usuário:', err)
    });
  }
}