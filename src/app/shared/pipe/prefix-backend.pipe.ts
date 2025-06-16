import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Pipe({
  name: 'prefixBackendStatic',
  standalone: true
})
export class PrefixBackendStaticPipe implements PipeTransform {
  private readonly prefix: string = environment.backendStatic
  transform(url: string, ...args: unknown[]): string {
    if (!url) {
      return '';
    }
    return this.prefix + '/' + url;
  }

}
