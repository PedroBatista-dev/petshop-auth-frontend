// src/app/shared/components/generic-autocomplete/generic-autocomplete.component.ts
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { startWith, map, debounceTime, takeUntil } from 'rxjs/operators';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

// Interfaces para tipagem
import { BaseService } from '../../services/base/base.service'; 
import { MaterialImports } from '../../material/material.imports';
import { ControlErrorDisplayDirective } from '../../directives/control-error-display.directive';

export interface AutocompleteItem {
  id: string;
  [key: string]: any; 
}

@Component({
  selector: 'app-generic-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    ControlErrorDisplayDirective,
  ],
  templateUrl: './generic-autocomplete.component.html',
  styleUrls: ['./generic-autocomplete.component.scss']
})
export class GenericAutocompleteComponent implements OnInit, OnDestroy {
  @Input() control!: AbstractControl; // O FormControl do formulário pai
  @Input() label!: string; // Label do campo
  @Input() placeholder!: string; // Placeholder do campo
  @Input() service!: BaseService<any>; // O serviço que fará a busca de dados (ex: EmpresaService)
  @Input() displayProperty!: string; // Propriedade a ser exibida no input (ex: 'razaoSocial', 'descricao')
  @Input() required: boolean = false; // Se o campo é obrigatório

  @Output() itemSelected = new EventEmitter<AutocompleteItem>(); // Emite o item completo selecionado

  filteredOptions!: Observable<AutocompleteItem[]>; // Opções filtradas para o autocomplete
  private allOptions: AutocompleteItem[] = []; // Todas as opções carregadas
  private destroy$ = new Subject<void>(); // Para desinscrever
  private selectedItemValue: AutocompleteItem | null = null;


  ngOnInit(): void {
    if (!this.control) {
      console.error('GenericAutocompleteComponent: FormControl não fornecido!');
      return;
    }

    // Carrega todas as opções do serviço uma vez
    if (this.service && typeof this.service.get === 'function') {
      (this.service.get('') as Observable<AutocompleteItem[]>)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (options) => 
                {
                    this.allOptions = options;
                    this.control.updateValueAndValidity({ emitEvent: true });
                },
            error: (err) => console.error('GenericAutocompleteComponent: Erro ao carregar opções:', err)
        }
        );
    } else {
      console.error(`GenericAutocompleteComponent: Serviço ou método 'GET' não fornecido ou inválido.`);
    }

    // Lógica de filtragem do autocomplete
    this.filteredOptions = this.control.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => {
          const filterValue = typeof value === 'object' && value !== null ? value[this.displayProperty] : value;
          return this._filter(filterValue || '');
        }),
        takeUntil(this.destroy$)
      );

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _filter(value: string): AutocompleteItem[] {
    const filterValue = value.toLowerCase();
    if (!this.allOptions) { return []; }
    return this.allOptions.filter(option =>
      (option[this.displayProperty] && String(option[this.displayProperty]).toLowerCase().includes(filterValue))
    );
  }

  displayFn = (value: string | AutocompleteItem): string => {
    if (value && typeof value === 'object') {
      return value[this.displayProperty];
    }
    if (value && typeof value === 'string' && this.allOptions) {
      const foundOption = this.allOptions.find(option => String(option[this.displayProperty]).toLowerCase() === value.toLowerCase());
      return foundOption ? foundOption[this.displayProperty] : value;
    }
    return ''; 
  };

  // Evento quando uma opção é selecionada
  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedItem: AutocompleteItem = event.option.value;
    this.selectedItemValue = selectedItem;
    this.itemSelected.emit(selectedItem); 
    this.control.setValue(selectedItem[this.displayProperty], { emitEvent: false });
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.control.updateValueAndValidity();
  }

  onInputBlur(): void {
    if (!this.selectedItemValue) {
        this.control.setValue('');
        this.control.markAsDirty();
        this.control.markAsTouched();
        this.control.updateValueAndValidity(); 
    }
  }

  onInputKeyDown(): void {
    this.selectedItemValue = null;
  }

  onClear(): void {
    this.control.setValue('');
    this.selectedItemValue = null;
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.control.updateValueAndValidity(); 
  }

}