import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MaterialModule } from '../../../../../shared/modules/material';
import { OrderStatusColorDirective } from '../../../../../shared/directive/order-status-color.directive';
import { TOrderStatus } from '../../../../../shared/interface/order-response.interface';
import { TPaymentMethod } from '../../../../../shared/interface/payment.interface';
import { MatDialog } from '@angular/material/dialog';
import { StatusSelectorComponent } from '../../../../../shared/component/status-selector/status-selector.component';
import { PaymentMethodSelectorComponent } from '../../../../../shared/component/payment-method-selector/payment-method-selector.component';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-order-form-status',
  standalone: true,
  imports: [
    CommonModule,

    OrderStatusColorDirective,

    MaterialModule
  ],
  templateUrl: './order-form-status.component.html',
  styleUrl: './order-form-status.component.scss'
})
export class OrderFormStatusComponent implements OnDestroy {
  @Input() status: TOrderStatus | null = null;
  @Input() paymentMethod: TPaymentMethod | null = null;

  @Output() statusChange: EventEmitter<TOrderStatus> = new EventEmitter<TOrderStatus>();
  @Output() paymentMethodChange: EventEmitter<TPaymentMethod> = new EventEmitter<TPaymentMethod>();

  orderStatusChange: TOrderStatus | null = null;
  orderPaymentMethodChange: TPaymentMethod | null = null;

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private readonly dialog: MatDialog
  ) { }

  onCancelChange() {
    if (this.orderStatusChange) {
      this.statusChange.emit(this.orderStatusChange);
    }
    if (this.orderPaymentMethodChange) {
      this.paymentMethodChange.emit(this.orderPaymentMethodChange);
    }
    this.orderStatusChange = null;
    this.orderPaymentMethodChange = null;
  }

  editStatus() {
    this.subscription.add(
      this.dialog.open(StatusSelectorComponent, {
        data: this.status,
      }).afterClosed().pipe(
        filter(status => !!status)
      ).subscribe(status => {
        this.orderStatusChange = status;
        this.statusChange.emit(status);
      })
    )
  }

  editPaymentMethod() {
    this.subscription.add(
      this.dialog.open(PaymentMethodSelectorComponent, {
        data: this.paymentMethod,
      }).afterClosed().pipe(
        filter(paymentMethod => !!paymentMethod)
      ).subscribe(paymentMethod => {
        this.orderPaymentMethodChange = paymentMethod;
        this.paymentMethodChange.emit(paymentMethod);
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
