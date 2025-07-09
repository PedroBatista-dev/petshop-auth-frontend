// src/app/shared/components/base/base.component.ts
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'; 
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../../core/auth/auth.service';

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
}