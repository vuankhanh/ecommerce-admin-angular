import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { MaterialModule } from '../../../../shared/modules/material';
import { BreakpointDetectionService } from '../../../../service/breakpoint-detection.service';
import { ProductCategoryService } from '../../../../service/api/product-category.service';
import { Router } from '@angular/router';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { TProductCategoryModel } from '../../../../shared/interface/product-category.interface';
import { IPagination } from '../../../../shared/interface/pagination.interface';
import { APP_LANGUAGE } from '../../../../shared/constant/lang.constant';

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [
    CommonModule,

    PrefixBackendStaticPipe,

    MaterialModule
  ],
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.scss'
})
export class ProductCategoryListComponent {
  readonly lang = inject(APP_LANGUAGE);
  getData$ = this.productCategoryService.getAll();
  productsCategories$: Observable<TProductCategoryModel[]> = this.getData$.pipe(
    map((res) => res.data)
  )
  pagination$: Observable<IPagination> = this.getData$.pipe(
    map((res) => res.paging)
  )
  // paginationConstant;

  isMobile$ = this.breakpointDetectionService.isMobile$;
  displayedColumns: string[] = ['thumbnail', 'name', 'parent', 'isActive', 'action'];
  constructor(
    private router: Router,
    private productCategoryService: ProductCategoryService,
    private breakpointDetectionService: BreakpointDetectionService,
  ) { }

  onCreateEvent() {
    this.router.navigate(['dashboard/product-category/create']);
  }

  onViewEvent(element: TProductCategoryModel) {
    this.router.navigate(['dashboard/product-category/detail', element._id]);
  }

  onEditEvent(element: TProductCategoryModel) {
    this.router.navigate(['dashboard/product-category/edit', element._id]);
  }
}
