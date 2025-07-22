import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../../../../shared/modules/material';
import { IDelivery } from '../../../../../shared/interface/address.interface';
import { AddressPipe } from '../../../../../shared/pipe/address.pipe';
import { filter, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddressSelectorComponent } from '../../../../../shared/component/address-selector/address-selector.component';
import { DeliveryComponent } from '../../../../../shared/component/delivery/delivery.component';

@Component({
  selector: 'app-order-form-delivery',
  standalone: true,
  imports: [
    CommonModule,

    AddressPipe,

    MaterialModule
  ],
  templateUrl: './order-form-delivery.component.html',
  styleUrl: './order-form-delivery.component.scss'
})
export class OrderFormDeliveryComponent implements OnDestroy {
  @Input() orderDelivery: IDelivery | null = null;

  deliveryWillChange: IDelivery | null = null;

  @Output() deliveryWillChangeEmit: EventEmitter<IDelivery | null> = new EventEmitter<IDelivery | null>();

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly dialog: MatDialog
  ) { }

  onChangeDelivery(delivery: IDelivery) {
    this.subscription.add(
      this.dialog.open(DeliveryComponent, {
        data: delivery,
        panelClass: 'delivery-modal'
      }).afterClosed().pipe(
        filter((result: Partial<IDelivery>) => !!result),
      ).subscribe((result: Partial<IDelivery>) => {
        const newDelivery: IDelivery = Object.assign({}, this.orderDelivery, result);
        this.deliveryWillChange = newDelivery;
        this.deliveryWillChangeEmit.emit(this.deliveryWillChange);
      })
    )
  }

  onCancelChange() {
    this.deliveryWillChange = null;
    this.deliveryWillChangeEmit.emit(this.deliveryWillChange);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
