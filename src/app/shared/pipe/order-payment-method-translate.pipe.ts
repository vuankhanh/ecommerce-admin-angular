import { inject, Pipe, PipeTransform } from '@angular/core';
import { PAYMENT_METHOD_LABEL } from '../constant/payment.constant';
import { TPaymentMethod } from '../interface/payment.interface';
import { APP_LANGUAGE } from '../constant/lang.constant';

@Pipe({
  name: 'orderPaymentMethodTranslate',
  standalone: true
})
export class OrderPaymentMethodTranslatePipe implements PipeTransform {
  private readonly lang = inject(APP_LANGUAGE);
  transform(value: TPaymentMethod, ...args: unknown[]): string {
    return PAYMENT_METHOD_LABEL[value]?.[this.lang] || value;
  }
}
