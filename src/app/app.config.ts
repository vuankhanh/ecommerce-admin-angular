import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './shared/core/interceptor/auth.interceptor';
import { LoadingInterceptor } from './shared/core/interceptor/loading.interceptor';
import { DatePipe, IMAGE_CONFIG } from '@angular/common';
import { CurrencyCustomPipe } from './shared/pipe/currency-custom.pipe';
import { provideIconConfig } from './shared/provider/icon-config.provider';
import { PrefixBackendStaticPipe } from './shared/pipe/prefix-backend.pipe';
import { AddressPipe } from './shared/pipe/address.pipe';
import { ReplaceNewLinePipe } from './shared/pipe/replace-new-line.pipe';
import { ToastrService } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(HttpClientModule),
    provideAnimationsAsync(),
    provideIconConfig(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true, disableImageLazyLoadWarning: true } },
    ToastrService,
    PrefixBackendStaticPipe,
    CurrencyCustomPipe,
    AddressPipe,
    ReplaceNewLinePipe,
    DatePipe
  ]
};
