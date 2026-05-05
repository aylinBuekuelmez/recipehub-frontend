import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.loadFromLocalStorage();

  if (authService.isLoggedin()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};