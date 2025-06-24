import { Pipe, PipeTransform } from '@angular/core';
import { IDistrict, IProvince, IWard } from '../interface/vn-public-apis.interface';

interface TAddress {
  province: IProvince;
  district: IDistrict;
  ward: IWard;
  street: string;
}

@Pipe({
  name: 'address',
  standalone: true
})
export class AddressPipe implements PipeTransform {

  transform(value: TAddress, ...args: unknown[]): string {
    if (!this.isValidAddress(value)) {
      throw new Error('Invalid address');
    }

    // Nếu hợp lệ, trả về chuỗi địa chỉ
    return `${value.street}, ${value.ward.name_with_type}, ${value.district.name_with_type}, ${value.province.name_with_type}`;
  }

  private isValidAddress(value: any): boolean {
    return value?.province?.name_with_type && value?.district?.name_with_type && value?.ward?.name_with_type && value?.street;
  }
}