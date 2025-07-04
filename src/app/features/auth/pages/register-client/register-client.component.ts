// src/app/features/auth/pages/register-client/register-client.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MaterialImports } from '../../../../shared/material/material.imports';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NotificationService } from '../../../../shared/services/notification.service';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // Para registrar o cliente no backend
import { environment } from '../../../../../environments/environment';
import { cpfValidator } from '../../../../shared/validators/cpf.validator';

@Component({
  selector: 'app-register-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ...MaterialImports,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.scss']
})
export class RegisterClientComponent {
  registerForm: FormGroup;
  isLoading = false;
  private apiUrl = environment.backendAuthUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private http: HttpClient // Injetar HttpClient para fazer a requisição de registro
  ) {
    this.registerForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      cpf: ['', [Validators.required, cpfValidator()]],
      dataNascimento: ['', Validators.required], // Pode precisar de um MatDatePicker
      sexo: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, this.matchPasswords('password', 'confirmPassword')]]
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
    if (this.registerForm.invalid) {
      this.notificationService.error('Erro no Formulário', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.isLoading = true;
    const formValue = this.registerForm.value;

    let dataNascimentoFormatada = '';
    if (formValue.dataNascimento) {
      const date = new Date(formValue.dataNascimento);
      dataNascimentoFormatada = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    }

    // O backend espera 'dataNascimento' como string AAAA-MM-DD
    const userData = {
      nomeCompleto: formValue.nomeCompleto,
      cpf: formValue.cpf,
      dataNascimento: dataNascimentoFormatada, // Assumindo formato YYYY-MM-DD
      sexo: formValue.sexo,
      estadoCivil: formValue.estadoCivil,
      telefone: formValue.telefone,
      email: formValue.email,
      password: formValue.password
      // codigoCargoId e codigoEmpresaId são definidos no backend para clientes auto-registrados
    };

    // Chamada para o endpoint de registro de cliente do seu backend
    this.http.post(`${this.apiUrl}/auth/register/cliente`, userData).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.notificationService.success('Cadastro Realizado!', 'Seu cadastro foi efetuado com sucesso. Faça login para acessar.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        let errorMessage = 'Erro ao cadastrar. Tente novamente.';
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }
        this.notificationService.error('Erro no Cadastro', errorMessage);
        console.error('Erro durante o cadastro:', err);
      }
    });
  }

  onBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}