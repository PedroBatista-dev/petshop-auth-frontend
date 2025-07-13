import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../projects/shared-ui-utils/src/lib/components/base/base.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports } from '../../../../../../projects/shared-ui-utils/src/lib/material/material.imports';
import { ControlErrorDisplayDirective } from '../../../../../../projects/shared-ui-utils/src/lib/directives/control-error-display.directive';
import { AuthService } from '../../../../../../projects/core-auth/src/lib/auth/auth.service';
import { NotificationService } from '../../../../../../projects/shared-ui-utils/src/lib/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { strongPasswordValidator } from '../../../../../../projects/shared-ui-utils/src/lib/validators/strong-password.validator';
import { matchPasswordsValidator } from '../../../../../../projects/shared-ui-utils/src/lib/validators/match-passwords.validator';
import { debounceTime, finalize } from 'rxjs';
import zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    ControlErrorDisplayDirective
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent extends BaseComponent {

  token: string | null = null; // Armazena o token da URL

  passwordStrength = 0; // Pontuação de 0 a 100%
  passwordStrengthText = 'Nenhuma';
  passwordStrengthColor = 'warn';

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    protected override fb: FormBuilder,
    protected override router: Router,
    protected override notificationService: NotificationService,
    protected override authService: AuthService,
    private route: ActivatedRoute
  ) {
    super(fb, router, notificationService, authService);
  }

  override onBuildForm(): void {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]]
    },
    {
      validators: [
        matchPasswordsValidator('newPassword', 'confirmPassword')
      ]
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    // Tenta pegar o token da query parameter da URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      if (!this.token) {
        this.notificationService.error('Erro', 'Token de recuperação de senha não encontrado na URL.');
        this.router.navigate(['/auth/forgot-password']); // Redireciona se não tiver token
      }
    });

    // Observa as mudanças no campo 'password' para calcular a força
    this.form.get('newPassword')?.valueChanges
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

  override onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Erro no Formulário', 'Por favor, preencha todos os campos e certifique-se que as senhas coincidem.');
      this.markAllFormFieldsAsTouched();
      return;
    }
    if (!this.token) {
      this.notificationService.error('Erro', 'Token de recuperação inválido ou ausente.');
      this.router.navigate(['/auth/forgot-password']);
      return;
    }

    this.isLoading = true;
    const { newPassword } = this.form.value;

    this.authService.resetPassword(this.token, newPassword).pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.reset();
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
}
