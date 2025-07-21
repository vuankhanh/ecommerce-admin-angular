import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PrefixBackendStaticPipe } from '../../../../../shared/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../../../../shared/pipe/currency-custom.pipe';
import { MaterialModule } from '../../../../../shared/modules/material';
import { IOrderItem } from '../../../../../shared/interface/order-response.interface';
import { environment } from '../../../../../../environments/environment.development';
import { VietnameseAccentUtil } from '../../../../../shared/utitl/form-validator/vietnamese-accent.util';

@Component({
  selector: 'app-order-form-item',
  standalone: true,
  imports: [
    CommonModule,
    PrefixBackendStaticPipe,
    CurrencyCustomPipe,

    MaterialModule
  ],
  templateUrl: './order-form-item.component.html',
  styleUrl: './order-form-item.component.scss'
})
export class OrderFormItemComponent {
  @Input() orderItems: IOrderItem[] | null = null;
  onViewProduct(orderItem: IOrderItem) {
    const productSlug = orderItem.productSlug || this.getSlugFromName(orderItem);
    const url = `${environment.client}/san-pham/${orderItem.productCategorySlug}/${productSlug}`;
    window.open(url, '_blank');
  }

  private getSlugFromName(orderItem: IOrderItem): string {
    const toNonAccentVietnamese = VietnameseAccentUtil.toNonAccentVietnamese(orderItem.productName);
    return VietnameseAccentUtil.replaceSpaceToDash(toNonAccentVietnamese);
  }

  onChangeOrderItems(orderItems: IOrderItem[] | null) {}
}
