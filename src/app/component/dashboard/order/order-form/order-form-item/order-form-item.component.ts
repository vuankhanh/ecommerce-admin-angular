import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { PrefixBackendStaticPipe } from '../../../../../shared/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../../../../shared/pipe/currency-custom.pipe';
import { MaterialModule } from '../../../../../shared/modules/material';
import { IOrderItem } from '../../../../../shared/interface/order-response.interface';
import { environment } from '../../../../../../environments/environment.development';
import { VietnameseAccentUtil } from '../../../../../shared/utitl/form-validator/vietnamese-accent.util';
import { filter, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OrderItemModifyComponent } from '../../../../../shared/component/order-item-modify/order-item-modify.component';

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
export class OrderFormItemComponent implements OnDestroy {
  @Input() orderItems: IOrderItem[] | null = null;

  orderItemsWillChange: IOrderItem[] | null = null;

  private readonly subscription = new Subscription();

  constructor(
    private readonly dialog: MatDialog
  ) { }

  onViewProduct(orderItem: IOrderItem) {
    const productSlug = orderItem.productSlug || this.getSlugFromName(orderItem);
    const url = `${environment.client}/san-pham/${orderItem.productCategorySlug}/${productSlug}`;
    window.open(url, '_blank');
  }

  private getSlugFromName(orderItem: IOrderItem): string {
    const toNonAccentVietnamese = VietnameseAccentUtil.toNonAccentVietnamese(orderItem.productName);
    return VietnameseAccentUtil.replaceSpaceToDash(toNonAccentVietnamese);
  }

  onChangeOrderItems(orderItems: IOrderItem[] | null) {
    this.subscription.add(
      this.dialog.open(OrderItemModifyComponent, {
        data: orderItems,
        panelClass: 'order-item-modify-modal',
        autoFocus: false,
      }).afterClosed().pipe(
        filter((result: IOrderItem[] | null) => !!result),
      ).subscribe((result: IOrderItem[] | null) => {
        this.orderItemsWillChange = result;
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
