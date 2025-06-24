import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ProductCategoryService } from '../../../../service/api/product-category.service';
import { TProductCategoryModel } from '../../../../shared/interface/product-category.interface';

export const productCategoryResolver: ResolveFn<Observable<TProductCategoryModel>> = (route, state) => {
  const producService: ProductCategoryService = inject(ProductCategoryService);
  const id = route.paramMap.get('id');
  if (!id) return EMPTY;
  return producService.getDetail(id);
};
