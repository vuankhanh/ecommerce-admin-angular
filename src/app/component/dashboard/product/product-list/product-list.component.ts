import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material';
import { Router } from '@angular/router';
import { ProductService } from '../../../../service/api/product.service';
import { BreakpointDetectionService } from '../../../../service/breakpoint-detection.service';
import { Subscription } from 'rxjs';
import { TProductModel } from '../../../../shared/interface/product.interface';
import { IPagination } from '../../../../shared/interface/pagination.interface';
import { paginationConstant } from '../../../../shared/constant/pagination.constant';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../../../shared/pipe/currency-custom.pipe';
import { APP_LANGUAGE } from '../../../../shared/constant/lang.constant';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,

    PrefixBackendStaticPipe,
    CurrencyCustomPipe,

    MaterialModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnDestroy {
  readonly lang = inject(APP_LANGUAGE);
  products?: TProductModel[];
  pagination: IPagination = paginationConstant;

  isMobile$ = this.breakpointDetectionService.isMobile$;
  displayedColumns: string[] = ['thumbnail', 'name', 'price', 'availability', 'action'];

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private productService: ProductService,
    private breakpointDetectionService: BreakpointDetectionService,
  ) { }

  ngOnInit() {
    this.initProduct('', this.pagination.page, this.pagination.size);
  }

  private initProduct(productName: string, page: number, size: number) {
    this.subscription.add(
      this.productService.getAll(productName, page, size).subscribe((res) => {
        this.products = res.data;
        this.pagination = res.paging;
      })
    );
  }

  onCreateEvent() {
    this.router.navigate(['dashboard/product/create']);
  }

  onViewEvent(element: TProductModel) {
    this.router.navigate(['dashboard/product/detail', element._id]);
  }

  onEditEvent(element: TProductModel) {
    this.router.navigate(['dashboard/product/edit', element._id]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
