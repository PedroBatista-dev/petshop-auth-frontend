
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFirstCapitalLetter]',
  standalone: true
})
export class PrimeiraLetraMaiusculaDirective {

  preposicoes: Array<string> = [
    'da',
    'das',
    'de',
    'do',
    'dos',
    'para',
    'que',
    'com'
  ];

  constructor(private element: ElementRef) {}

  @HostListener('blur') onBlur() {
    this.updateFirstLetter();
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    if (event.keyCode == 13)
      this.updateFirstLetter();
  }

  updateFirstLetter() {
    let input: HTMLInputElement = this.element.nativeElement;
    let text = input.value;
    text = text.trim();
    let words = text.split(' ');
    let result: Array<string> = [];
    for (let word of words) {
      if (word !== '') {
        if (this.preposicoes.indexOf(word) > -1)
          result.push(word.toLowerCase())
        else
          result.push(word[0].toUpperCase() + word.substring(1, word.length).toLowerCase())
      }
    }
    input.value = result.join(' ');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

}