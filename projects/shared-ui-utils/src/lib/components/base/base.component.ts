// src/app/shared/components/base/base.component.ts
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'; 
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../../../../core-auth/src/lib/auth/auth.service';

@Directive()
export abstract class BaseComponent implements OnInit, OnDestroy {
  public form!: FormGroup; 
  public isLoading = false;
  protected destroy$ = new Subject<void>(); 

  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected notificationService: NotificationService,
    protected authService: AuthService 
  ) {
    this.onBuildForm();
  }

  abstract onSubmit(): void;
  
  abstract onBuildForm(): void;

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  markAllFormFieldsAsTouched(): void {
    if (this.form) {
      this.form.markAllAsTouched();
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatDate(label: string): void {
    if (this.form.value[label] instanceof Date) { 
      const date = this.form.value[label];
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      this.form.get(label)?.setValue(`${year}-${month}-${day}`); 
    } else if (typeof this.form.value[label] === 'string' && this.form.value[label].includes('/')) {
        const parts = this.form.value[label].split('/');
        if (parts.length === 3) {
          this.form.get(label)?.setValue(`${parts[2]}-${parts[1]}-${parts[0]}`); // AAAA-MM-DD
        }
    }
  }
}