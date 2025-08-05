import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material';
import { BehaviorSubject, catchError, combineLatest, EMPTY, filter, forkJoin, lastValueFrom, map, Observable, of, shareReplay, Subscription, switchMap, take, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../service/api/order.service';
import { OrderStatus, OrderStatusTransition } from '../../../../shared/constant/order.constant';
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
import { concat } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/component/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../../../shared/interface/confirmation-dialog.interface';
import { InputReasonOrderCancelledComponent } from '../../../../shared/component/input-reason-order-cancelled/input-reason-order-cancelled.component';

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

  nextPossiblestate$ = this.order$.pipe(
    map(order => {
      const status = order.status as TOrderStatus;
      console.log(status);
      const statuses = OrderStatusTransition[status];
      return statuses ? statuses : null;
    }),
    filter(statuses => !!statuses && statuses.length > 0),
  )

  private readonly bOrderPaymentMethodWillChange: BehaviorSubject<TPaymentMethod | null> = new BehaviorSubject<TPaymentMethod | null>(null);
  readonly bOrderItemsWillChange: BehaviorSubject<OrderItemEntity | null> = new BehaviorSubject<OrderItemEntity | null>(null);
  private readonly bDeliveryWillChange: BehaviorSubject<IDelivery | null> = new BehaviorSubject<IDelivery | null>(null);
  private readonly bTotalWillChange: BehaviorSubject<OrderTotalEntity | null> = new BehaviorSubject<OrderTotalEntity | null>(null);

  private orderUpdateRequest$ = combineLatest([
    this.bOrderPaymentMethodWillChange.asObservable(),
    this.bOrderItemsWillChange.asObservable(),
    this.bDeliveryWillChange.asObservable(),
    this.bTotalWillChange.asObservable()
  ]);

  canModifyOrderStatus$ = this.order$?.pipe(
    map(order => [OrderStatus.PENDING].includes(order.status as OrderStatus)),
  )
  orderParamUpdate$: Observable<boolean> = this.orderUpdateRequest$.pipe(
    map(result => result.some(item => item !== null)),
    catchError(() => of(false)),
    shareReplay(1)
  );

  private readonly subsciprition: Subscription = new Subscription();
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private readonly orderService: OrderService,
  ) { }

  async goBackOrderDetail() {
    const orderId = await lastValueFrom(this.activatedRoute.params.pipe(
      map(params => params['id']),
      take(1),
    ))
    this.router.navigate(['/dashboard/order/detail', orderId]);
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
    this.subsciprition.add(
      forkJoin([this.canModifyOrderStatus$.pipe(take(1)), this.orderParamUpdate$.pipe(take(1))]).pipe(
        map(([canModifyOrderStatus, canModifyOrderParam]) => canModifyOrderStatus && canModifyOrderParam),
        filter(canModify => !!canModify),
        switchMap(() => {
          const data: ConfirmationDialogData = {
            title: 'Xác nhận cập nhật đơn hàng',
            message: 'Bạn có chắc chắn muốn cập nhật đơn hàng này không?',
            confirmText: 'Cập nhật',
            cancelText: 'Hủy',
            type: 'info'
          };

          return this.dialog.open(ConfirmationDialogComponent, {
            data
          }).afterClosed().pipe(
            filter((result: boolean) => !!result),
            switchMap((result) => this.orderUpdateRequest$.pipe(
              switchMap(([paymentMethod, orderItems, delivery, total]) => {
                const data: IOrderUpdateRequest = {};
                if (paymentMethod) data.paymentMethod = paymentMethod;
                if (delivery) data.delivery = delivery;
                if (total) {
                  if (total.discount != orderDetail.discount) data.discount = total.discount;
                  if (total.deliveryFee != orderDetail.deliveryFee) data.deliveryFee = total.deliveryFee;
                }
                if (orderItems) data.orderItems = orderItems.orderItems.map(item => ({ productId: item.productId, quantity: item.quantity }));

                return this.orderService.updateOrder(orderDetail._id, data)
              })
            ))
          )
        })
      ).subscribe({
        next: (updatedOrder) => {
          console.log('Cập nhật đơn hàng thành công:', updatedOrder);
          this.goBackOrderDetail();
        },
        error: (error) => {
          console.error('Cập nhật đơn hàng thất bại:', error);
        },
        complete: () => {
          console.log('Cập nhật đơn hàng hoàn tất');
        }
      })
    );
  }

  nextOrderStatus(orderDetail: TOrderDetailModel, nextStatus: TOrderStatus) {
    const data: ConfirmationDialogData = {
      title: 'Xác nhận cập nhật trạng thái đơn hàng',
      message: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này sang ${nextStatus} không?`,
      confirmText: 'Cập nhật',
      cancelText: 'Hủy',
      type: 'info'
    };

    this.subsciprition.add(
      this.dialog.open(ConfirmationDialogComponent, {
        data
      }).afterClosed().pipe(
        filter(result => !!result),
        switchMap(() => this.orderService.updateStatusOrder(orderDetail._id, nextStatus)),
      ).subscribe({
        next: () => {
          console.log('Cập nhật trạng thái đơn hàng thành công');
          this.goBackOrderDetail();
        },
        error: (error) => {
          console.error('Cập nhật trạng thái đơn hàng thất bại:', error);
        },
        complete: () => {
          console.log('Cập nhật trạng thái đơn hàng hoàn tất');
        }
      })
    )
  }

  cancelOrder(orderDetail: TOrderDetailModel) {
    this.subsciprition.add(
      this.dialog.open(InputReasonOrderCancelledComponent).afterClosed().pipe(
        filter((reason: string) => !!reason),
        switchMap((reason: string) => {
          const data: ConfirmationDialogData = {
            title: 'Xác nhận hủy đơn hàng',
            message: `Bạn có chắc chắn muốn hủy đơn hàng này không?
            
            Lý do: ${reason}`,
            confirmText: 'Hủy',
            cancelText: 'Không',
            type: 'danger'
          };

          return this.dialog.open(ConfirmationDialogComponent, {
            data
          }).afterClosed().pipe(
            filter(result => !!result),
            switchMap(() => this.orderService.updateStatusOrder(orderDetail._id, 'Đã hủy', reason)),
          )
        })
      ).subscribe({
        next: () => {
          this.goBackOrderDetail();
        },
        error: (error) => {
          console.error('Cập nhật trạng thái đơn hàng thất bại:', error);
        },
        complete: () => {
          console.log('Cập nhật trạng thái đơn hàng hoàn tất');
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subsciprition.unsubscribe();
  }
}
