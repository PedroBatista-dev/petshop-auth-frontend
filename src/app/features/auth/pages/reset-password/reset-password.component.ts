// src/app/features/auth/pages/reset-password/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MaterialImports } from '../../../../shared/material/material.imports';
import { AuthService } from '../../../../core/auth/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { debounceTime, finalize } from 'rxjs/operators';
import { strongPasswordValidator } from '../../../../shared/validators/strong-password.validator';
import zxcvbn from 'zxcvbn';
import { ControlErrorDisplayDirective } from '../../../../shared/directives/control-error-display.directive';

@Component({
    selector: 'app-reset-password',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ...MaterialImports,
        ControlErrorDisplayDirective
    ],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  token: string | null = null; // Armazena o token da URL

  passwordStrength = 0; // Pontuação de 0 a 100%
  passwordStrengthText = 'Nenhuma';
  passwordStrengthColor = 'warn';

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute // Injete ActivatedRoute para ler parâmetros da URL
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]]
    },
    {
      validators: [
        this.matchPasswordsGroup
      ]
    });
  }

  ngOnInit(): void {
    // Tenta pegar o token da query parameter da URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      if (!this.token) {
        this.notificationService.error('Erro', 'Token de recuperação de senha não encontrado na URL.');
        this.router.navigate(['/auth/forgot-password']); // Redireciona se não tiver token
      }
    });

    // Observa as mudanças no campo 'password' para calcular a força
    this.resetPasswordForm.get('newPassword')?.valueChanges
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

  private matchPasswordsGroup: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const passwordControl = group.get('newPassword');
    const confirmPasswordControl = group.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value && (confirmPasswordControl.touched || confirmPasswordControl.dirty)) {
      confirmPasswordControl.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    if (passwordControl.value === confirmPasswordControl.value && confirmPasswordControl.hasError('mismatch')) {
        confirmPasswordControl.setErrors(null);
    }

    return null; 
  };

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.notificationService.error('Erro no Formulário', 'Por favor, preencha todos os campos e certifique-se que as senhas coincidem.');
      return;
    }
    if (!this.token) {
      this.notificationService.error('Erro', 'Token de recuperação inválido ou ausente.');
      this.router.navigate(['/auth/forgot-password']);
      return;
    }

    this.isLoading = true;
    const { newPassword } = this.resetPasswordForm.value;

    this.authService.resetPassword(this.token, newPassword).pipe(
      finalize(() => {
        this.isLoading = false;
        this.resetPasswordForm.reset();
      })
    ).subscribe({
      next: () => {
        // Mensagem de sucesso e navegação já tratadas no AuthService
      },
      error: (err) => {
        // Mensagem de erro já tratada no AuthService
        console.error('Erro ao redefinir senha:', err);
      }
    });
  }

  onBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}