import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MaterialModule } from '../../modules/material';
import { PrefixBackendStaticPipe } from '../../pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../pipe/currency-custom.pipe';
import { NumberInputComponent } from '../number-input/number-input.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TOrderItem } from '../../interface/order-response.interface';
import { OrderItemEntity } from '../../../entity/order.entity';
import { MatListItem } from '@angular/material/list';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../interface/confirmation-dialog.interface';
import { BreakpointDetectionService } from '../../../service/breakpoint-detection.service';
import { filter, lastValueFrom, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-order-item-modify',
  standalone: true,
  imports: [
    CommonModule,

    PrefixBackendStaticPipe,
    CurrencyCustomPipe,

    NumberInputComponent,

    MaterialModule
  ],
  templateUrl: './order-item-modify.component.html',
  styleUrls: ['./order-item-modify.component.scss']
})
export class OrderItemModifyComponent implements OnInit, OnDestroy {
  private readonly matDialog = inject(MatDialog)
  private readonly dialogRef = inject(MatDialogRef<OrderItemModifyComponent>);
  readonly orderItems = inject<TOrderItem[] | null>(MAT_DIALOG_DATA);
  readonly isMobile$ = inject(BreakpointDetectionService).isMobile$;
  orderItemEntity: OrderItemEntity | null = null;

  private readonly renderer2: Renderer2 = inject(Renderer2);

  private readonly subscription: Subscription = new Subscription();
  ngOnInit(): void {
    if (this.orderItems) {
      this.orderItemEntity = new OrderItemEntity(this.orderItems);
    }
  }

  orderItemsQuantityChange(orderItem: TOrderItem, quantity: number) {
    console.log(orderItem);

    this.orderItemEntity?.changeQuantity(orderItem._id, quantity);
  }

  async onIsZero(orderItem: TOrderItem, cartItemElement: MatListItem) {
    const isMobile: boolean = await lastValueFrom(this.isMobile$.pipe(
      take(1)
    ));

    if (!isMobile) {
      return;
    }
    
    this.removeOrderItem(orderItem, cartItemElement);
  }

  removeOrderItem(orderItem: TOrderItem, cartItemElement: MatListItem) {
    this.subscription.add(
      this.confirmRemoveOrderItem$(orderItem).subscribe(_ => {
        this.renderer2.addClass(cartItemElement._elementRef.nativeElement, 'cart-item-removed');
        setTimeout(() => {
          this.orderItemEntity?.removeItem(orderItem._id);
        }, 450);
      })
    )
  }

  private confirmRemoveOrderItem$(orderItem: TOrderItem) {
    const data: ConfirmationDialogData = {
      title: 'Xác nhận xóa sản phẩm',
      message: `Bạn có chắc chắn muốn xóa sản phẩm "${orderItem.productName}" khỏi đơn hàng này?`,
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      type: 'warning'
    }
    return this.matDialog.open(ConfirmationDialogComponent, {
      data
    }).afterClosed().pipe(
      filter((result: boolean) => !!result)
    )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSaveChanges() {
    console.log('Save changes');
    
    const isChangedItems$ = await lastValueFrom(this.orderItemEntity!.isChangedItems$.pipe(
      take(1)
    ));

    if (!isChangedItems$) {
      return;
    }

    this.dialogRef.close(this.orderItemEntity!.orderItems);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
