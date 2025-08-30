import { inject, Pipe, PipeTransform } from '@angular/core';
import { ORDER_FROM_LABEL, OrderFrom } from '../constant/order.constant';
import { APP_LANGUAGE } from '../constant/lang.constant';

@Pipe({
  name: 'orderFromTranslate',
  standalone: true
})
export class OrderFromTranslatePipe implements PipeTransform {
  private readonly lang = inject(APP_LANGUAGE);
  transform(value: `${OrderFrom}`): string {
    return ORDER_FROM_LABEL[value]?.[this.lang] || value;
  }
}
