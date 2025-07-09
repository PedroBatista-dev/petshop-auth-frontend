// src/app/shared/validators/match-passwords.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Retorna um ValidatorFn que valida se dois campos de senha em um FormGroup coincidem.
 *
 * @param passwordControlName O nome do FormControl para a senha principal (ex: 'password').
 * @param confirmPasswordControlName O nome do FormControl para a confirmação de senha (ex: 'confirmPassword').
 * @returns ValidationErrors | null
 */
export function matchPasswordsValidator(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const passwordControl = group.get(passwordControlName);
    const confirmPasswordControl = group.get(confirmPasswordControlName);

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
}