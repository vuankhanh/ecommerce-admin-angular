import { Pipe, PipeTransform } from '@angular/core';
import { ORDER_STATUS_LABEL, OrderStatus } from '../constant/order.constant';

@Pipe({
  name: 'orderStatusTranslate',
  standalone: true
})
export class OrderStatusTranslatePipe implements PipeTransform {

  transform(value: `${OrderStatus}`, ...args: unknown[]): string {
    const lang = 'vi';
    return ORDER_STATUS_LABEL[value]?.[lang] || value;
  }

}
