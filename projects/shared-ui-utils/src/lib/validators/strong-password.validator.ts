// src/app/shared/validators/strong-password.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    if (!password) {
      return null; 
    }

    const hasMinLength = password.length >= 8; 
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password); // Caracteres especiais comuns

    const errors: ValidationErrors = {};

    if (!hasMinLength) {
      errors['minlengthStrong'] = true; // Chave de erro para comprimento mínimo
    }
    if (!hasUpperCase) {
      errors['uppercaseRequired'] = true; // Chave de erro para maiúscula
    }
    if (!hasLowerCase) {
      errors['lowercaseRequired'] = true; // Chave de erro para minúscula
    }
    if (!hasNumeric) {
      errors['numericRequired'] = true; // Chave de erro para número
    }
    if (!hasSpecialChar) {
      errors['specialCharRequired'] = true; // Chave de erro para caractere especial
    }

    return Object.keys(errors).length ? errors : null; // Retorna erros se houver, senão nulo
  };
}