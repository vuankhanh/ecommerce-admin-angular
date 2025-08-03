import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material';
import { BehaviorSubject, catchError, combineLatest, EMPTY, filter, lastValueFrom, map, Observable, of, shareReplay, Subscription, switchMap, take, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../service/api/order.service';
import { OrderStatus } from '../../../../shared/constant/order.constant';
import { TOrderDetailModel, TOrderStatus } from '../../../../shared/interface/order-response.interface';
import { HeaderPageContainerComponent } from '../../../../shared/component/header-page-container/header-page-container.component';
import { IDelivery } from '../../../../shared/interface/address.interface';
import { OrderFormDeliveryComponent } from './order-form-delivery/order-form-delivery.component';
import { OrderFormItemComponent } from './order-form-item/order-form-item.component';
import { OrderItemEntity, OrderTotalEntity } from '../../../../entity/order.entity';
import { OrderFormTotalComponent } from './order-form-total/order-form-total.component';
import { OrderFormStatusComponent } from './order-form-status/order-form-status.component';
import { TPaymentMethod } from '../../../../shared/interface/payment.interface';
import { IOrderUpdateRequest } from '../../../../shared/interface/order-request.interface';
import { OrderFromColorDirective } from '../../../../shared/directive/order-from-color.directive';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,

    HeaderPageContainerComponent,
    OrderFormStatusComponent,
    OrderFormItemComponent,
    OrderFormDeliveryComponent,
    OrderFormTotalComponent,

    OrderFromColorDirective,

    MaterialModule
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss'
})
export class OrderFormComponent implements OnDestroy {
  order$ = this.activatedRoute.params.pipe(
    filter(params => !!params['id']),
    map(params => params['id']),
    switchMap(id => this.orderService.getDetail(id)),
    catchError(() => {
      this.router.navigate(['/dashboard/order/list']);
      return EMPTY;
    }),
    shareReplay(1)
  );

  private readonly bOrderStatusWillChange: BehaviorSubject<TOrderStatus | null> = new BehaviorSubject<TOrderStatus | null>(null);
  private readonly bOrderPaymentMethodWillChange: BehaviorSubject<TPaymentMethod | null> = new BehaviorSubject<TPaymentMethod | null>(null);
  readonly bOrderItemsWillChange: BehaviorSubject<OrderItemEntity | null> = new BehaviorSubject<OrderItemEntity | null>(null);
  private readonly bDeliveryWillChange: BehaviorSubject<IDelivery | null> = new BehaviorSubject<IDelivery | null>(null);
  private readonly bTotalWillChange: BehaviorSubject<OrderTotalEntity | null> = new BehaviorSubject<OrderTotalEntity | null>(null);

  private orderUpdateRequest$ = combineLatest([
    this.bOrderStatusWillChange.asObservable(),
    this.bOrderPaymentMethodWillChange.asObservable(),
    this.bOrderItemsWillChange.asObservable(),
    this.bDeliveryWillChange.asObservable(),
    this.bTotalWillChange.asObservable()
  ]);

  canProcessOrder$: Observable<boolean> = this.order$?.pipe(
    map(order => [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPING].includes(order.status as OrderStatus)),
    switchMap(canProcess => {
      if (!canProcess) {
        of(false);
      }
      return this.orderUpdateRequest$.pipe(
        map(result => result.some(item => item !== null)),
        catchError(() => of(false))
      );
    })
  );
  private readonly subsciprition: Subscription = new Subscription();
  constructor(
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

  onStatusChange(status: TOrderStatus | null) {
    this.bOrderStatusWillChange.next(status);
  }

  onPaymentMethodChange(paymentMethod: TPaymentMethod | null) {
    this.bOrderPaymentMethodWillChange.next(paymentMethod);
  }

  onChangeOrderItems(orderItems: OrderItemEntity | null) {
    this.bOrderItemsWillChange.next(orderItems);
  }

  onChangeDelivery(delivery: IDelivery | null) {
    this.bDeliveryWillChange.next(delivery);
  }

  onOrderTotalChange(orderTotal: OrderTotalEntity | null) {
    this.bTotalWillChange.next(orderTotal);
  }

  async processOrder(orderDetail: TOrderDetailModel) {
    const canProcess = await lastValueFrom(this.canProcessOrder$.pipe(
      take(1),
    ));

    if (!canProcess) {
      return;
    }

    this.subsciprition.add(
      this.orderUpdateRequest$.pipe(
        switchMap(([status, paymentMethod, orderItems, delivery, total]) => {
          const data: IOrderUpdateRequest = {};
          if(status) data.status = status;
          if(paymentMethod) data.paymentMethod = paymentMethod;
          if(delivery) data.delivery = delivery;
          if(total) {
            if(total.discount != orderDetail.discount) data.discount = total.discount;
            if(total.deliveryFee != orderDetail.deliveryFee) data.deliveryFee = total.deliveryFee;
          }
          if(orderItems) data.orderItems = orderItems.orderItems.map(item => ({ productId: item.productId, quantity: item.quantity }));
          return this.orderService.updateOrder(orderDetail._id, data)
        }),
        take(1),
      ).subscribe({
        next: (updatedOrder) => {
          console.log('Cập nhật đơn hàng thành công:', updatedOrder);
        },
        error: (error) => {
          console.error('Cập nhật đơn hàng thất bại:', error);
        },
        complete: () => {
          this.bOrderStatusWillChange.next(null);
          this.bOrderPaymentMethodWillChange.next(null);
          this.bOrderItemsWillChange.next(null);
          this.bDeliveryWillChange.next(null);
          this.bTotalWillChange.next(null);
          this.goBackOrderDetail();
        }
      })
    )
    // this.router.navigate(['/dashboard/order/detail', orderId]);
  }

  ngOnDestroy(): void {
    this.subsciprition.unsubscribe();
  }
}
