import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthStateService } from '../../../service/auth_state.service';
import { AuthService } from '../../../service/api/auth.service';
import { LocalStorageService } from '../../../service/local-storage.service';
import { LocalStorageKey } from '../../constant/local_storage.constant';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  const authStateService = inject(AuthStateService);
  const authService = inject(AuthService);
  const localStorageService = inject(LocalStorageService);

  if (!request.url.includes('/login')) {
    const accessToken = localStorageService.get(LocalStorageKey.ACCESSTOKEN);

    if (accessToken) {
      const cloned = request.clone({
        headers: request.headers.set("authorization", "Bearer " + accessToken)
      });
      return next(cloned).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && !request.url.includes('/login') && error.status === 401) {
            return handle401Error(request, next, authStateService, authService, localStorageService);
          }
          return throwError(() => error);
        })
      );
    }
  }
  return next(request);
};

function handle401Error(
  request: HttpRequest<any>, 
  next: HttpHandlerFn,
  authStateService: AuthStateService,
  authService: AuthService,
  localStorageService: LocalStorageService
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;

    const refreshToken = localStorageService.get(LocalStorageKey.REFRESHTOKEN);
    const isLogin = authStateService.isLogin;
    
    if (isLogin) {
      const refreshTokenRequest = authService.refreshToken(refreshToken!);
      return refreshTokenRequest.pipe(
        switchMap(accessToken => {
          localStorageService.set(LocalStorageKey.ACCESSTOKEN, accessToken);
          isRefreshing = false;
          const cloned = request.clone({
            headers: request.headers.set("authorization", "Bearer " + accessToken)
          });
          return next(cloned);
        }),
        catchError((error) => {
          isRefreshing = false;
          if (error.status == '403') {
            authStateService.logout();
          }
          return throwError(() => error);
        })
      );
    }
  }

  return next(request);
}