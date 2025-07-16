import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './shared/core/interceptor/auth.interceptor';
import { loadingInterceptor } from './shared/core/interceptor/loading.interceptor';
import { DatePipe, IMAGE_CONFIG, registerLocaleData } from '@angular/common';
import { CurrencyCustomPipe } from './shared/pipe/currency-custom.pipe';
import { provideIconConfig } from './shared/provider/icon-config.provider';
import { PrefixBackendStaticPipe } from './shared/pipe/prefix-backend.pipe';
import { AddressPipe } from './shared/pipe/address.pipe';
import { ReplaceNewLinePipe } from './shared/pipe/replace-new-line.pipe';
import { provideToastr } from 'ngx-toastr';
import { showToastInterceptor } from './shared/core/interceptor/show-toast.interceptor';
import localeVi from '@angular/common/locales/vi';
import { MAT_DATE_LOCALE } from '@angular/material/core';

registerLocaleData(localeVi);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([authInterceptor, loadingInterceptor, showToastInterceptor])
    ),
    provideAnimationsAsync(),
    provideIconConfig(),
    { provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true, disableImageLazyLoadWarning: true } },
    { provide: LOCALE_ID, useValue: 'vi' },
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    provideToastr(),
    PrefixBackendStaticPipe,
    CurrencyCustomPipe,
    AddressPipe,
    ReplaceNewLinePipe,
    DatePipe
  ]
};
