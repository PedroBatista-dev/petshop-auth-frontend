// src/app/shared/validators/cpf.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value;

    if (!cpf) {
      return null; // Retorna nulo se o campo estiver vazio, a validação 'required' já lida com isso.
    }

    // Remove caracteres não numéricos (pontos e hífens)
    const cleanedCpf = cpf.replace(/[^\d]+/g, '');

    // Verifica se tem 11 dígitos após a limpeza
    if (cleanedCpf.length !== 11) {
      return { cpfInvalido: true };
    }

    // Impede sequências repetidas (ex: "111.111.111-11", "000.000.000-00")
    if (/^(\d)\1{10}$/.test(cleanedCpf)) {
      return { cpfInvalido: true };
    }

    // Algoritmo de validação de CPF
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cleanedCpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
      resto = 0;
    }
    if (resto !== parseInt(cleanedCpf.substring(9, 10))) {
      return { cpfInvalido: true };
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cleanedCpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
      resto = 0;
    }
    if (resto !== parseInt(cleanedCpf.substring(10, 11))) {
      return { cpfInvalido: true };
    }

    return null; // CPF é válido
  };
}