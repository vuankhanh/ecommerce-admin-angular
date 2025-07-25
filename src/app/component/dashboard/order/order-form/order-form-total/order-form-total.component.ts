import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../../../../shared/modules/material';
import { OrderItemEntity, OrderTotalEntity } from '../../../../../entity/order.entity';
import { CurrencyCustomPipe } from '../../../../../shared/pipe/currency-custom.pipe';
import { TOrderDetailModel } from '../../../../../shared/interface/order-response.interface';
import { MatDialog } from '@angular/material/dialog';
import { InputFeeComponent } from '../../../../../shared/component/input-fee/input-fee.component';
import { IInputFeeDialogData } from '../../../../../shared/interface/input-fee-dialog.interface';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-order-form-total',
  standalone: true,
  imports: [
    CommonModule,

    CurrencyCustomPipe,

    MaterialModule
  ],
  templateUrl: './order-form-total.component.html',
  styleUrl: './order-form-total.component.scss'
})
export class OrderFormTotalComponent implements OnChanges, OnDestroy {
  @Input() orderDetail: TOrderDetailModel | null = null;
  @Input() orderItemsWillChange: OrderItemEntity | null = null;

  @Output() orderTotalChangeEmit: EventEmitter<OrderTotalEntity | null> = new EventEmitter<OrderTotalEntity | null>();

  rawOrderTotal: OrderTotalEntity | null = null;
  orderItemsWillChangeTotal: OrderTotalEntity | null = null;

  private readonly subscription = new Subscription();
  constructor(
    private readonly dialog: MatDialog
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.orderItemsWillChange);
    const orderDetailChange = changes['orderDetail'];
    const orderItemsWillChange = changes['orderItemsWillChange'];

    if (orderDetailChange && (orderDetailChange.currentValue != orderDetailChange.previousValue)) {
      this.rawOrderTotal = new OrderTotalEntity(
        orderDetailChange.currentValue.subTotal,
        orderDetailChange.currentValue.discount,
        orderDetailChange.currentValue.deliveryFee
      );
    }

    if (orderItemsWillChange && (orderItemsWillChange.currentValue != orderItemsWillChange.previousValue)) {
      if (this.orderItemsWillChangeTotal) {
        if (!orderItemsWillChange.currentValue) {
          this.orderItemsWillChangeTotal.updateSubTotal(this.rawOrderTotal?.subTotal || 0);
        } else {
          this.orderItemsWillChangeTotal.updateSubTotal(orderItemsWillChange.currentValue.subTotal);
        }
      } else {
        this.orderItemsWillChangeTotal = new OrderTotalEntity(
          orderItemsWillChange.currentValue.subTotal,
          orderItemsWillChange.currentValue.discount,
          orderItemsWillChange.currentValue.deliveryFee
        );
      }
    }
  }

  editDiscountFee() {
    this.subscription.add(
      this.editFee('discount').subscribe((fee: number) => {
        if (!this.orderItemsWillChangeTotal) {
          this.orderItemsWillChangeTotal = new OrderTotalEntity(
            this.orderDetail?.subTotal || 0,
            this.orderDetail?.discount || 0,
            this.orderDetail?.deliveryFee || 0
          );
        }
        this.orderItemsWillChangeTotal!.updateDiscount(fee);
        this.orderTotalChangeEmit.emit(this.orderItemsWillChangeTotal);
      })
    )
  }

  editDeliveryFee() {
    this.subscription.add(
      this.editFee('delivery').subscribe((fee: number) => {
        if (!this.orderItemsWillChangeTotal) {
          this.orderItemsWillChangeTotal = new OrderTotalEntity(
            this.orderDetail?.subTotal || 0,
            this.orderDetail?.discount || 0,
            this.orderDetail?.deliveryFee || 0
          );
        }
        this.orderItemsWillChangeTotal!.updateDeliveryFee(fee);
        this.orderTotalChangeEmit.emit(this.orderItemsWillChangeTotal);
      })
    )
  }

  private editFee(type: 'discount' | 'delivery') {
    const title = type === 'discount' ? 'Cập nhật giảm giá' : 'Cập nhật phí giao hàng';
    const message = type === 'discount' ? 'Vui lòng nhập mức giảm giá mới:' : 'Vui lòng nhập phí giao hàng mới:';
    const fee = type === 'discount' ? this.orderItemsWillChangeTotal?.discount : this.orderItemsWillChangeTotal?.deliveryFee;
    const data: IInputFeeDialogData = {
      title,
      message,
      confirmText: 'Cập nhật',
      cancelText: 'Hủy',
      type: 'info',
      fee
    };

    return this.dialog.open(InputFeeComponent, {
      data
    }).afterClosed().pipe(
      filter((fee: number) => fee !== undefined && fee !== null)
    )
  }

  onCancelChange() {
    if (!this.orderItemsWillChange) {
      this.orderItemsWillChangeTotal = null;
    }else {
      this.orderItemsWillChangeTotal?.updateDiscount(this.rawOrderTotal?.discount || 0);
      this.orderItemsWillChangeTotal?.updateDeliveryFee(this.rawOrderTotal?.deliveryFee || 0);
    }
    this.orderTotalChangeEmit.emit(this.orderItemsWillChangeTotal);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
