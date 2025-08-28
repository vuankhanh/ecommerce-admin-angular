import { Pipe, PipeTransform } from '@angular/core';
import { ORDER_FROM_LABEL, OrderFrom } from '../constant/order.constant';

@Pipe({
  name: 'orderFromTranslate',
  standalone: true
})
export class OrderFromTranslatePipe implements PipeTransform {

  transform(value: `${OrderFrom}`, ...args: unknown[]): string {
    const lang = 'vi'
    return ORDER_FROM_LABEL[value]?.[lang] || value;
  }

}
