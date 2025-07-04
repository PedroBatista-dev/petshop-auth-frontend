// src/app/shared/material/material.imports.ts
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select'; // NOVO
import { MatDatepickerModule } from '@angular/material/datepicker'; // NOVO
import { MatNativeDateModule } from '@angular/material/core'; // NOVO: Necessário para MatDatepicker

export const MaterialImports = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatProgressBarModule,
  MatSelectModule,     
  MatDatepickerModule, 
  MatNativeDateModule  
];