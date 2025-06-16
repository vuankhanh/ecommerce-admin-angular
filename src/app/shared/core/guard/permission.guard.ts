import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../../../service/api/auth.service';

@Injectable({
  providedIn: 'root'
})
class PermissionsService {
  constructor(
    private router: Router,
    private authService: AuthService,
  ){

  }
  canActivate(): Observable<boolean> {
    return this.authService.checkToken().pipe(
      map(res=>true),
      catchError(err=>{
        this.router.navigate(['/login'])
        return of(false)}
      )
    )
  }
}

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(PermissionsService).canActivate()
};
