import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const showToastInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const toastrService = inject(ToastrService);

  return next(request).pipe(
    tap({
      // Operation failed; error is an HttpErrorResponse
      error: (error: HttpErrorResponse) => {
        console.log(error);
        
        toastrService.error(error.error.message, error.error.error);
      }
    })
  );
};