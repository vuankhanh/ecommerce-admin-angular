import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../../service/loader.service';

let totalRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  const loadingService = inject(LoaderService);
  
  totalRequests++;
  loadingService.setLoading(true);
  
  return next(request).pipe(
    finalize(() => {
      totalRequests--;
      if (totalRequests === 0) {
        loadingService.setLoading(false);
      }
    })
  );
};