import { Pipe, PipeTransform } from '@angular/core';
import { FileSizeUnit, FileType } from '../constant/file.constant';

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {
  transform(value: number | string , args: `${FileType}`): string {
    if (typeof value != 'string' && typeof value != 'number') throw new Error('Không đúng kiểu dữ liệu của file size. Chỉ nhận kiểu number hoặc string');
    if (typeof value === 'string') {
      value = parseFloat(value);
      if (isNaN(value)) throw new Error('Giá trị không phải là một số hợp lệ. Vui lòng nhập một số hợp lệ');
    }

    if(args === FileType.KB) {
      return (value / FileSizeUnit.KB).toFixed(2) + FileType.KB;
    }else if(args === FileType.MB) {
      return (value / FileSizeUnit.MB).toFixed(2) + FileType.MB;
    }else if(args === FileType.GB) {
      return (value / FileSizeUnit.GB).toFixed(2) + FileType.GB;
    }else if(args === FileType.TB) {
      return (value / FileSizeUnit.TB).toFixed(2) + FileType.TB;
    }
    return value.toString();
  }
}
