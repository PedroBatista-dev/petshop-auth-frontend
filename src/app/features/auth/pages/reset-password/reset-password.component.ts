// src/app/features/auth/pages/reset-password/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Adicione ActivatedRoute

import { MaterialImports } from '../../../../shared/material/material.imports';
import { AuthService } from '../../../../core/auth/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ...MaterialImports
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  token: string | null = null; // Armazena o token da URL

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute // Injete ActivatedRoute para ler parâmetros da URL
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, this.matchPasswords('newPassword', 'confirmPassword')]]
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
  }

  private matchPasswords(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = control.root.get(passwordControlName); // Acessa o campo password
      const confirmPasswordControl = control.root.get(confirmPasswordControlName); // Acessa o campo confirmPassword

      // Garante que ambos os controles existem
      if (!passwordControl || !confirmPasswordControl) {
        return null; // Retorna null se os controles não existirem (não deveria acontecer)
      }

      // Se as senhas são diferentes, retorna o erro 'mismatch'
      if (passwordControl.value !== confirmPasswordControl.value) {
        return { mismatch: true };
      }

      return null; // As senhas coincidem
    };
  }

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