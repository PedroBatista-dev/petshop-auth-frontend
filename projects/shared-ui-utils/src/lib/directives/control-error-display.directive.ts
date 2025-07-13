// src/app/shared/directives/control-error-display.directive.ts
import { Directive, Input, ElementRef, OnInit, OnDestroy, AfterViewChecked } from '@angular/core'; 
import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appControlErrorDisplay]',
  standalone: true
})
export class ControlErrorDisplayDirective implements OnInit, OnDestroy, AfterViewChecked { 
  @Input('appControlErrorDisplay') control!: AbstractControl;
  @Input() errorMessages: { [key: string]: string } = {}; 

  private destroy$ = new Subject<void>();
  private defaultErrorMessages: { [key: string]: string } = {
    required: 'Este campo é obrigatório.',
    email: 'E-mail inválido.',
    minlength: 'Mínimo de caracteres não atingido.',
    maxlength: 'Máximo de caracteres excedido.',
    pattern: 'Formato inválido.',
    cpfInvalido: 'CPF inválido.',
    cnpjInvalido: 'CNPJ inválido.',
    mismatch: 'As senhas não coincidem.', 
    matDatepickerParse: 'Formato de data inválido. Use DD/MM/AAAA.',
    matDatepickerInvalid: 'Data inválida.',
    telefoneInvalido: 'Telefone inválido.',
    minlengthStrong: 'Mínimo de 8 caracteres.',
    uppercaseRequired: 'Pelo menos 1 letra maiúscula.',
    lowercaseRequired: 'Pelo menos 1 letra minúscula.',
    numericRequired: 'Pelo menos 1 número.',
    specialCharRequired: 'Pelo menos 1 caractere especial.',
    dateFormatInvalido: 'Data inválida. Use DD/MM/AAAA.',
    dateInFuture: 'Data não pode ser no futuro.'
  };

  constructor(private el: ElementRef) {}

  ngOnInit(): void { // Use OnInit
    if (!this.control) {
      console.warn('ControlErrorDisplayDirective: Nenhum FormControl foi passado para a diretiva via [appControlErrorDisplay].');
      return;
    }
  }

  ngAfterViewChecked(): void {
    const messages = { ...this.defaultErrorMessages, ...this.errorMessages };
    this.updateErrorMessage(messages);

  }

  private updateErrorMessage(messages: { [key: string]: string }): void {
    this.el.nativeElement.textContent = ''; 

    if (this.control.invalid && (this.control.touched || this.control.dirty)) {
      if (this.control.hasError('required')) {
        this.el.nativeElement.textContent = messages['required'];
        return;
      }

      for (const errorKey in this.control.errors) {
        if (this.control.errors.hasOwnProperty(errorKey)) {
          this.el.nativeElement.textContent = messages[errorKey] || `Erro: ${errorKey}`;
          return;
        }
      }
    }
    if (this.control.parent && this.control.parent.hasError('mismatch') && (this.control.touched || this.control.dirty)) {
        if (this.control.parent.errors?.['mismatch']) { 
             this.el.nativeElement.textContent = messages['mismatch'];
        }
    }
  }

  ngOnDestroy(): void { 
    this.destroy$.next();
    this.destroy$.complete();
  }
}