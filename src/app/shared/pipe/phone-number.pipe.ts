import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber',
  standalone: true
})
export class PhoneNumberPipe implements PipeTransform {
  transform(value: string): unknown {
    if (!value) {
      return '';
    }

    // Extract the last 6 digits and the remaining part
    const lastSix = value.slice(-6);
    const remaining = value.slice(0, -6);

    // Format the number as YYYY XXX XXX
    return `${remaining} ${lastSix.slice(0, 3)} ${lastSix.slice(3)}`;
  }

}
