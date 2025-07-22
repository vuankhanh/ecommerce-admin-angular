import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { MaterialModule } from '../../modules/material';
import { PrefixBackendStaticPipe } from '../../pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../pipe/currency-custom.pipe';
import { NumberInputComponent } from '../number-input/number-input.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TOrderItem } from '../../interface/order-response.interface';
import { OrderItemEntity } from '../../../entity/order.entity';
import { MatListItem } from '@angular/material/list';

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
export class OrderItemModifyComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<OrderItemModifyComponent>);
  readonly orderItems = inject<TOrderItem[] | null>(MAT_DIALOG_DATA);

  orderItemEntity: OrderItemEntity | null = null;

  private readonly renderer2: Renderer2 = inject(Renderer2);

  ngOnInit(): void {
    if(this.orderItems){
      this.orderItemEntity = new OrderItemEntity(this.orderItems);  
    }
  }


  orderItemsQuantityChange(orderItem: TOrderItem, quantity: number) {
    this.orderItemEntity?.changeQuantity(orderItem._id, quantity);
  }

  removeOrderItem(orderItem: TOrderItem, cartItemElement: MatListItem) {
    console.log(cartItemElement);
    console.log(this.renderer2);
    
    // this.renderer2.addClass(cartItemElement, 'cart-item-removed');
    this.orderItemEntity?.removeItem(orderItem._id);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
