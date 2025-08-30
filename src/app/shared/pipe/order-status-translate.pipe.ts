import { inject, Pipe, PipeTransform } from '@angular/core';
import { ORDER_STATUS_LABEL, OrderStatus } from '../constant/order.constant';
import { APP_LANGUAGE } from '../constant/lang.constant';

@Pipe({
  name: 'orderStatusTranslate',
  standalone: true
})
export class OrderStatusTranslatePipe implements PipeTransform {
  private readonly lang = inject(APP_LANGUAGE);
  transform(value: `${OrderStatus}`): string {
    return ORDER_STATUS_LABEL[value]?.[this.lang] || value;
  }
}
