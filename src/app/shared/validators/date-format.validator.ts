import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Se o valor for nulo, indefinido ou uma string vazia, não há erro de formato aqui.
    // Deixe o Validators.required lidar com campos vazios se for o caso.
    if (value === null || value === undefined || value === '') {
      return null;
    }

    let dateString: string;
    let parsedDate: Date;

    // 1. Lida com objetos Date nativos (vindos do MatDatepicker com NativeDateAdapter)
    if (value instanceof Date) {
      parsedDate = value;
      // Formata para 'DD/MM/YYYY' para validação consistente
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexed
      const year = parsedDate.getFullYear();
      dateString = `${day}/${month}/${year}`;
    }
    // 2. Lida com strings (vindo da digitação manual no input)
    else if (typeof value === 'string') {
      dateString = value;
      // Tenta parsear a string. O construtor de Date pode ser inconsistente,
      // então faremos a validação manual após a regex.
      parsedDate = new Date(dateString); // Inicializa para evitar erro de tipo
    }
    // 3. Lida com tipos inesperados
    else {
      return { dateFormatInvalido: { message: 'Tipo de valor inesperado para data.' } };
    }

    // Primeiro, valida o formato da string (DD/MM/AAAA) usando regex
    const pattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(pattern);

    if (!match) {
      return { dateFormatInvalido: { message: 'Formato esperado DD/MM/AAAA.' } };
    }

    // Extrai dia, mês e ano da string validada pela regex
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Cria um objeto Date usando os componentes extraídos.
    // Usamos UTC para evitar problemas de fuso horário durante a criação,
    // mas a comparação será feita localmente. Mês é 0-indexed no Date.
    const testDate = new Date(year, month - 1, day);

    // Valida se a data criada é válida e se os componentes batem.
    // Isso pega datas inválidas como "30/02" ou "31/04".
    // Se o mês ou dia da 'testDate' não corresponderem, significa que a data original era inválida.
    if (isNaN(testDate.getTime()) || // Verifica se a data é "Invalid Date"
        testDate.getDate() !== day ||
        testDate.getMonth() !== (month - 1) ||
        testDate.getFullYear() !== year) {
      return { dateFormatInvalido: { message: 'Data inválida (ex: 30/02, 31/04).' } };
    }

    // Validação de data no futuro (para data de nascimento)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera o tempo para comparar apenas a data

    if (testDate.getTime() > today.getTime()) {
      return { dateInFuture: { message: 'Data de nascimento não pode ser no futuro.' } };
    }

    return null; // A data é válida e no formato correto
  };
}