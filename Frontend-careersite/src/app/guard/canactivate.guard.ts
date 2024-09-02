import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const canActivateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localData = localStorage.getItem('angular18Token');
  if (localData) {
    return true;
  } else {
    router.navigateByUrl('login');
    return false;
  }
};