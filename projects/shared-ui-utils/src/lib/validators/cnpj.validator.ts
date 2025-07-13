// src/app/shared/validators/cnpj.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cnpj = control.value;

    if (!cnpj) {
      return null; 
    }

    // Remove caracteres não numéricos (pontos, barras, hífens)
    const cleanedCnpj = String(cnpj).replace(/[^\d]+/g, '');

    // Verifica se tem 14 dígitos
    if (cleanedCnpj.length !== 14) {
      return { cnpjInvalido: true };
    }

    // Impede sequências repetidas (ex: "11.111.111/1111-11", "00.000.000/0000-00")
    if (/^(\d)\1{13}$/.test(cleanedCnpj)) {
      return { cnpjInvalido: true };
    }

    // Algoritmo de validação de CNPJ
    let tamanho = cleanedCnpj.length - 2;
    let numeros = cleanedCnpj.substring(0, tamanho);
    let digitos = cleanedCnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    let resultado: number;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado !== parseInt(digitos.charAt(0))) {
      return { cnpjInvalido: true };
    }

    tamanho = tamanho + 1;
    numeros = cleanedCnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado !== parseInt(digitos.charAt(1))) {
      return { cnpjInvalido: true };
    }

    return null; 
  };
}