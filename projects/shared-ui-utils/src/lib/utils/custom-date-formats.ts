// src/app/shared/utils/custom-date-formats.ts
import { MatDateFormats } from '@angular/material/core';

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY', // Formato que o usuário vai digitar e o datepicker vai tentar "parsear"
  },
  display: {
    dateInput: 'DD/MM/YYYY', // Formato que a data vai ser exibida no input
    monthYearLabel: 'MMM YYYY', // Formato do label de mês/ano no cabeçalho do calendário
    dateA11yLabel: 'LL', // Formato para acessibilidade
    monthYearA11yLabel: 'MMMM YYYY', // Formato para acessibilidade
  },
};