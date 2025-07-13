import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUpperCase]',
  standalone: true
})
export class UpperCaseDirective {

  constructor(private element: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  @HostListener('blur') onBlur() {
    this.element.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    if (event.keyCode == 13)
      this.element.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
  }
}