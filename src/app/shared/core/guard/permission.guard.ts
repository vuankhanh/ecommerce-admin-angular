import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../../../service/api/auth.service';

export const permissionGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.checkToken().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login'])
      return of(false)
    }
    )
  )
};
