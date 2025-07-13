import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../../core-auth/src/lib/auth/auth.service';
import { map } from 'rxjs';

export const noAuthGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isLoggedIn().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        router.navigate(['/dashboard']); 
        return false; 
      }
      return true; 
    })
  );
};