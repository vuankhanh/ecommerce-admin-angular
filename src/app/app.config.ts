import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './shared/core/interceptor/auth.interceptor';
import { loadingInterceptor } from './shared/core/interceptor/loading.interceptor';
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
    provideHttpClient(
      withInterceptors([authInterceptor, loadingInterceptor])
    ),
    provideAnimationsAsync(),
    provideIconConfig(),
    { provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true, disableImageLazyLoadWarning: true } },
    ToastrService,
    PrefixBackendStaticPipe,
    CurrencyCustomPipe,
    AddressPipe,
    ReplaceNewLinePipe,
    DatePipe
  ]
};
