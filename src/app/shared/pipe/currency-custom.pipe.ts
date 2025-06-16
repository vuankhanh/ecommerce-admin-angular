import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vndCurrency',
  standalone: true
})
export class CurrencyCustomPipe implements PipeTransform {
  transform(value: number): string {
    if (value != null) {
      return value.toLocaleString('vi-VN').replace(/\./g, ',') + ' VND';
    }
    return '';
  }
}
