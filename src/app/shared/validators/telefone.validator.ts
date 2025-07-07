// src/app/shared/validators/telefone.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function telefoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const telefone = control.value;

    if (!telefone) {
      return null;
    }

    // Remove caracteres não numéricos (parênteses, espaços, hífens) que a máscara adiciona
    const cleanedTelefone = String(telefone).replace(/[^\d]+/g, '');

    // Formatos válidos:
    // DDD (2 dígitos) + 9 dígitos (celular) = 11 dígitos
    // DDD (2 dígitos) + 8 dígitos (fixo) = 10 dígitos

    // Verifica se o número de dígitos está entre 10 e 11
    if (cleanedTelefone.length < 10 || cleanedTelefone.length > 11) {
      return { telefoneInvalido: true };
    }

    // Se o telefone tem 11 dígitos (formato de celular com DDD)
    if (cleanedTelefone.length === 11) {
        // Verifica se o terceiro dígito (o primeiro do número após o DDD) não é '9'
        if (cleanedTelefone.charAt(2) !== '9') {
          return { telefoneInvalido: true };
        }
    }

    return null; // Telefone é válido
  };
}