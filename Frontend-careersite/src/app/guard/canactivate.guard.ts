import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const canActivateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if `window` is defined to ensure this code runs only in the browser
  if (typeof window !== 'undefined') {
    const localData = localStorage.getItem('angular18Token');
    if (localData) {
      return true;
    } else {
      router.navigateByUrl('login');
      return false;
    }
  } else {
    // Handle server-side scenario
    router.navigateByUrl('login');
    return false;
  }
};
