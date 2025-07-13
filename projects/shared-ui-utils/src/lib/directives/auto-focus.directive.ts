import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.element.nativeElement.focus();
    }, 0);
  }

}