import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material';
import { OrderService } from '../../../../service/api/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { OrderStatusColorDirective } from '../../../../shared/directive/order-status-color.directive';
import { AddressPipe } from '../../../../shared/pipe/address.pipe';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../../../shared/pipe/currency-custom.pipe';
import { HeaderPageContainerComponent } from '../../../../shared/component/header-page-container/header-page-container.component';
import { IOrderItem } from '../../../../shared/interface/order-response.interface';
import { VietnameseAccentUtil } from '../../../../shared/utitl/form-validator/vietnamese-accent.util';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,

    AddressPipe,
    PrefixBackendStaticPipe,
    CurrencyCustomPipe,

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
    switchMap(id => this.orderService.getDetail(id))
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
    const toNonAccentVietnamese = VietnameseAccentUtil.toNonAccentVietnamese(orderItem.productName);
    return VietnameseAccentUtil.replaceSpaceToDash(toNonAccentVietnamese);
  }

}
