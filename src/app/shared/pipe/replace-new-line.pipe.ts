import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceNewLine',
  standalone: true
})
export class ReplaceNewLinePipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return value.replace(/\n/g, '<br>');
  }

}
