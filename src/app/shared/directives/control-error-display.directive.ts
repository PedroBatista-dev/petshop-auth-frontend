// src/app/shared/directives/control-error-display.directive.ts
import { Directive, Input, ElementRef, AfterViewChecked } from '@angular/core'; 
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appControlErrorDisplay]',
  standalone: true
})
export class ControlErrorDisplayDirective implements AfterViewChecked {
  @Input('appControlErrorDisplay') control!: AbstractControl;

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
    telefoneInvalido: 'Telefone inválido. Ex: (DD) 9XXXX-XXXX ou (DD) XXXX-XXXX',
    minlengthStrong: 'Mínimo de 8 caracteres.',
    uppercaseRequired: 'Pelo menos 1 letra maiúscula.',
    lowercaseRequired: 'Pelo menos 1 letra minúscula.',
    numericRequired: 'Pelo menos 1 número.',
    specialCharRequired: 'Pelo menos 1 caractere especial.'
  };

  constructor(private el: ElementRef) {}

  ngAfterViewChecked(): void {
    this.updateErrorMessage({ ...this.defaultErrorMessages })
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
        if (this.control.hasError('mismatch') || (this.control.parent.errors && this.control.parent.errors['mismatch'])) {
             this.el.nativeElement.textContent = messages['mismatch'];
        }
    }
  }
}