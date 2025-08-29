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
import { provideNgxMask } from 'ngx-mask';
import { APP_LANGUAGE, Language } from './shared/constant/lang.constant';
import { OrderFromTranslatePipe } from './shared/pipe/order-from-translate.pipe';
import { OrderStatusTranslatePipe } from './shared/pipe/order-status-translate.pipe';
import { OrderPaymentMethodTranslatePipe } from './shared/pipe/order-payment-method-translate.pipe';

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
    { provide: APP_LANGUAGE, useValue: Language.VI },
    provideToastr(),
    PrefixBackendStaticPipe,
    CurrencyCustomPipe,
    AddressPipe,
    ReplaceNewLinePipe,
    DatePipe,
    OrderFromTranslatePipe,
    OrderStatusTranslatePipe,
    OrderPaymentMethodTranslatePipe,
    provideNgxMask()
  ]
};
