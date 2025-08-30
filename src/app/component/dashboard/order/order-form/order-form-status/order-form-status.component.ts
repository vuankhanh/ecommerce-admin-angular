import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MaterialModule } from '../../../../../shared/modules/material';
import { OrderStatusColorDirective } from '../../../../../shared/directive/order-status-color.directive';
import { TOrderStatus } from '../../../../../shared/interface/order-response.interface';
import { TPaymentMethod } from '../../../../../shared/interface/payment.interface';
import { MatDialog } from '@angular/material/dialog';
import { PaymentMethodSelectorComponent } from '../../../../../shared/component/payment-method-selector/payment-method-selector.component';
import { filter, Subscription } from 'rxjs';
import { OrderStatusTranslatePipe } from '../../../../../shared/pipe/order-status-translate.pipe';
import { OrderPaymentMethodTranslatePipe } from '../../../../../shared/pipe/order-payment-method-translate.pipe';

@Component({
  selector: 'app-order-form-status',
  standalone: true,
  imports: [
    CommonModule,

    OrderStatusTranslatePipe,
    OrderPaymentMethodTranslatePipe,

    OrderStatusColorDirective,

    MaterialModule
  ],
  templateUrl: './order-form-status.component.html',
  styleUrl: './order-form-status.component.scss'
})
export class OrderFormStatusComponent implements OnDestroy {
  @Input() status: TOrderStatus | null = null;
  @Input() paymentMethod: TPaymentMethod | null = null;
  @Input() isDisabled: boolean = false;

  // @Output() statusChange: EventEmitter<TOrderStatus | null> = new EventEmitter<TOrderStatus | null>();
  @Output() paymentMethodChange: EventEmitter<TPaymentMethod | null> = new EventEmitter<TPaymentMethod | null>();

  // orderStatusChange: TOrderStatus | null = null;
  orderPaymentMethodChange: TPaymentMethod | null = null;

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private readonly dialog: MatDialog
  ) { }

  onCancelChange() {
    this.orderPaymentMethodChange = null;
    this.paymentMethodChange.emit(this.orderPaymentMethodChange);
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
