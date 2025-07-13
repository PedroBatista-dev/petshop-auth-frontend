import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthFeatureRoutingModule } from './auth-feature-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialImports } from '../../../../projects/shared-ui-utils/src/lib/material/material.imports';
import { NgxMaskDirective } from 'ngx-mask';
import { ControlErrorDisplayDirective } from '../../../../projects/shared-ui-utils/src/lib/directives/control-error-display.directive';
import { PrimeiraLetraMaiusculaDirective } from '../../../../projects/shared-ui-utils/src/lib/directives/first-capital-letter.directive';
import { AutoFocusDirective } from '../../../../projects/shared-ui-utils/src/lib/directives/auto-focus.directive';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthFeatureRoutingModule,
    ReactiveFormsModule,
    ...MaterialImports,
    NgxMaskDirective,
    ControlErrorDisplayDirective,
    PrimeiraLetraMaiusculaDirective,
    AutoFocusDirective,
  ]
})
export class AuthFeatureModule { }
