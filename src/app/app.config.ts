// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideNgxMask } from 'ngx-mask';
import { AuthInterceptor } from '../../projects/core-auth/src/lib/interceptors/auth.interceptor';
import { CUSTOM_DATE_FORMATS } from '../../projects/shared-ui-utils/src/lib/utils/custom-date-formats';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withInterceptors([AuthInterceptor]), withFetch()),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }, 
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    provideNgxMask()
  ]
};