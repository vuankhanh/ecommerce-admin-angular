import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, EMPTY, filter, lastValueFrom, map, Observable, switchMap, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../service/api/order.service';
import { OrderStatus } from '../../../../shared/constant/order.constant';
import { IOrderItem } from '../../../../shared/interface/order-response.interface';
import { environment } from '../../../../../environments/environment.development';
import { VietnameseAccentUtil } from '../../../../shared/utitl/form-validator/vietnamese-accent.util';
import { AddressPipe } from '../../../../shared/pipe/address.pipe';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../../../shared/pipe/currency-custom.pipe';
import { OrderStatusColorDirective } from '../../../../shared/directive/order-status-color.directive';
import { HeaderPageContainerComponent } from '../../../../shared/component/header-page-container/header-page-container.component';
import { IDelivery } from '../../../../shared/interface/address.interface';
import { OrderFormDeliveryComponent } from './order-form-delivery/order-form-delivery.component';
import { OrderFormItemComponent } from './order-form-item/order-form-item.component';
import { OrderItemEntity, OrderTotalEntity } from '../../../../entity/order.entity';
import { OrderFormTotalComponent } from './order-form-total/order-form-total.component';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,

    AddressPipe,
    PrefixBackendStaticPipe,
    CurrencyCustomPipe,

    OrderStatusColorDirective,

    HeaderPageContainerComponent,
    OrderFormItemComponent,
    OrderFormDeliveryComponent,
    OrderFormTotalComponent,

    MaterialModule
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss'
})
export class OrderFormComponent {
  order$ = this.activatedRoute.params.pipe(
    filter(params => !!params['id']),
    map(params => params['id']),
    switchMap(id => this.orderService.getDetail(id)),
    catchError(() => {
      this.router.navigate(['/dashboard/order/list']);
      return EMPTY;
    })
  );

  canProcessOrder$: Observable<boolean> = this.order$?.pipe(
    map(order => [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPING].includes(order.status as OrderStatus))
  )

  orderItemsWillChange: OrderItemEntity | null = null;
  deliveryWillChange: IDelivery | null = null;
  totalWillChange: OrderTotalEntity | null = null;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly orderService: OrderService,
  ) { }

  async goBackOrderDetail() {
    const orderId = await lastValueFrom(this.activatedRoute.params.pipe(
      map(params => params['id']),
      take(1),
    ))
    this.router.navigate(['/dashboard/order/detail', orderId]);
  }

  onChangeOrderItems(orderItems: OrderItemEntity | null) {
    this.orderItemsWillChange = orderItems;
  }

  onChangeDelivery(delivery: IDelivery | null) {
    this.deliveryWillChange = delivery;
  }

  onOrderTotalChange(orderTotal: OrderTotalEntity | null) {
    this.totalWillChange = orderTotal;
  }

  async processOrder(orderId: string) {
    const canProcess = await lastValueFrom(this.canProcessOrder$.pipe(
      take(1),
    ));

    if (!canProcess) {
      return;
    }

    this.router.navigate(['/dashboard/order/detail', orderId]);
  }
}
