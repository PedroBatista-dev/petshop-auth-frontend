// src/app/features/auth/pages/register-client/register-client.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MaterialImports } from '../../../../shared/material/material.imports';
import { NgxMaskDirective } from 'ngx-mask';
import { NotificationService } from '../../../../shared/services/notification.service';
import { debounceTime, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; 
import { environment } from '../../../../../environments/environment';
import { cpfValidator } from '../../../../shared/validators/cpf.validator';
import { ControlErrorDisplayDirective } from '../../../../shared/directives/control-error-display.directive';
import { PrimeiraLetraMaiusculaDirective } from '../../../../shared/directives/first-capital-letter.directive';
import { AutoFocusDirective } from '../../../../shared/directives/auto-focus.directive';
import { telefoneValidator } from '../../../../shared/validators/telefone.validator';
import { strongPasswordValidator } from '../../../../shared/validators/strong-password.validator';
import zxcvbn from 'zxcvbn';
import { dateFormatValidator } from '../../../../shared/validators/date-format.validator';
import moment, { Moment } from 'moment';

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
    templateUrl: './register-client.component.html',
    styleUrls: ['./register-client.component.scss']
})
export class RegisterClientComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  private apiUrl = environment.backendAuthUrl;

  passwordStrength = 0; 
  passwordStrengthText = 'Nenhuma';
  passwordStrengthColor = 'warn';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private http: HttpClient 
  ) {
    this.registerForm = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, cpfValidator()]],
      dataNascimento: ['', [Validators.required, dateFormatValidator()]], 
      sexo: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      telefone: ['', [Validators.required, telefoneValidator()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required, this.matchPasswords('password', 'confirmPassword')]]
    });
  }

  ngOnInit(): void {
    // Observa as mudanças no campo 'password' para calcular a força
    this.registerForm.get('password')?.valueChanges
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
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.registerForm.value;

    let dataNascimentoFormatada = '';
    // Verifica se dataNascimento é um objeto Moment válido antes de formatar
    if (formValue.dataNascimento && moment.isMoment(formValue.dataNascimento) && formValue.dataNascimento.isValid()) {
      dataNascimentoFormatada = formValue.dataNascimento.format('YYYY-MM-DD'); // Formato AAAA-MM-DD para o backend
    } else {
      // Se não for um Moment válido, ou for null, trate como erro ou envie null/string vazia
      // Dependendo da sua API, você pode querer lançar um erro ou enviar null
      console.error('Data de nascimento inválida ou ausente para envio ao backend.');
      this.notificationService.error('Erro de Dados', 'A data de nascimento não está em um formato válido.');
      this.isLoading = false;
      return;
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