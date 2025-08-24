import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material';
import { OrderService } from '../../../../service/api/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, filter, lastValueFrom, map, Observable, shareReplay, switchMap, take } from 'rxjs';
import { OrderFromColorDirective } from '../../../../shared/directive/order-from-color.directive';
import { OrderStatusColorDirective } from '../../../../shared/directive/order-status-color.directive';
import { AddressPipe } from '../../../../shared/pipe/address.pipe';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../../../shared/pipe/currency-custom.pipe';
import { HeaderPageContainerComponent } from '../../../../shared/component/header-page-container/header-page-container.component';
import { IOrderItem } from '../../../../shared/interface/order-response.interface';
import { VietnameseAccentUtil } from '../../../../shared/utitl/form-validator/vietnamese-accent.util';
import { environment } from '../../../../../environments/environment.development';
import { OrderStatus } from '../../../../shared/constant/order.constant';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,

    AddressPipe,
    PrefixBackendStaticPipe,
    CurrencyCustomPipe,

    OrderFromColorDirective,
    OrderStatusColorDirective,

    HeaderPageContainerComponent,

    MaterialModule
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
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
  
  canProcessOrder$: Observable<boolean> = this.order$?.pipe(
    map(order => [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPING].includes(order.status as OrderStatus))
  )
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly orderService: OrderService,
  ) { }

  goBackOrder() {
    this.router.navigate(['/dashboard/order/list']);
  }

  onViewProduct(orderItem: IOrderItem) {
    const productSlug = orderItem.productSlug || this.getSlugFromName(orderItem);
    const url = `${environment.client}/san-pham/${orderItem.productCategorySlug}/${productSlug}`;
    window.open(url, '_blank');
  }

  private getSlugFromName(orderItem: IOrderItem): string {
    const toNonAccentVietnamese = VietnameseAccentUtil.toNonAccentVietnamese(orderItem.productName['vi']);
    return VietnameseAccentUtil.replaceSpaceToDash(toNonAccentVietnamese);
  }

  async processOrder(orderId: string) {
    const canProcess = await lastValueFrom(this.canProcessOrder$.pipe(
      take(1),
    ));

    if (!canProcess) {
      return;
    }

    this.router.navigate(['/dashboard/order/edit', orderId]);
  }

}
