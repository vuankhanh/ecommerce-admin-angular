import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY, map, } from 'rxjs';
import { MediaProductCategoryService } from '../../../../service/api/media-product-category.service';

export const productCategoryNameTitleResolver: ResolveFn<string> = (route, state) => {
  const mediaProductCategoryService = inject(MediaProductCategoryService);
  const router = inject(Router);
  const id = route.paramMap.get('id') as string;

  return mediaProductCategoryService.getDetail(id).pipe(
    map(res => res.name),
    catchError(() => {
      router.navigate(['dashboard/media/product-category']); // Redirect về danh sách
      return EMPTY; // Hủy navigation hiện tại
    })
  );
};
