import { ResolveFn } from '@angular/router';
import { ProductService } from '../../../../service/api/product.service';
import { inject } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { TProductModel } from '../../../../shared/interface/product.interface';

export const productResolver: ResolveFn<Observable<TProductModel>> = (route, state) => {
  const producService: ProductService = inject(ProductService);
  const id = route.paramMap.get('id');
  if (!id) return EMPTY;
  return producService.getDetail(id);
};
