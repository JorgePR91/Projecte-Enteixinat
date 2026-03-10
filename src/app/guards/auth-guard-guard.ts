import { inject } from '@angular/core';
import { Supaservice } from './../services/supaservice';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const supaservice = inject(Supaservice);
  const router = inject(Router);

  if(!supaservice.userSession()){
    router.navigate(['/login']);
    return false;
  }

  return true;
};
