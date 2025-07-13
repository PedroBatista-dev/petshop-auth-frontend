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
import { EmpresaService } from '../../../../../../projects/shared-ui-utils/src/lib/services/empresa/empresa.service';
import { cpfValidator } from '../../../../../../projects/shared-ui-utils/src/lib/validators/cpf.validator';
import { dateFormatValidator } from '../../../../../../projects/shared-ui-utils/src/lib/validators/date-format.validator';
import { telefoneValidator } from '../../../../../../projects/shared-ui-utils/src/lib/validators/telefone.validator';
import { strongPasswordValidator } from '../../../../../../projects/shared-ui-utils/src/lib/validators/strong-password.validator';
import { matchPasswordsValidator } from '../../../../../../projects/shared-ui-utils/src/lib/validators/match-passwords.validator';
import { debounceTime, finalize } from 'rxjs';
import { AutocompleteItem, GenericAutocompleteComponent } from '../../../../../../projects/shared-ui-utils/src/lib/components/generic-autocomplete/generic-autocomplete.component';
import { RegisterClientPayload } from '../../../../../../projects/core-auth/src/lib/auth/models/auth.model';
import zxcvbn from 'zxcvbn';

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
  styleUrl: './register-client.component.scss'
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
    this.form.get('password')?.valueChanges
      .pipe(
        debounceTime(300) 
      )
      .subscribe((password: string) => {
        if (password) {
          const result = zxcvbn(password);
          this.passwordStrength = (result.score + 1) * 20; 
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
      error: (err: any) => 
        console.error('Erro ao registrar usuário:', err)
    });
  }
}
