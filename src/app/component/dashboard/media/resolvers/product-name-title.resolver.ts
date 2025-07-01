import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY, map, } from 'rxjs';
import { MediaProductService } from '../../../../service/api/media-product.service';

export const productNameTitleResolver: ResolveFn<string> = (route, state) => {
  const mediaProductService = inject(MediaProductService);
  const router = inject(Router);
  const id = route.paramMap.get('id') as string;

  return mediaProductService.getDetail(id).pipe(
    map(res => res.name),
    catchError(() => {
      router.navigate(['dashboard/media/product']); // Redirect về danh sách
      return EMPTY; // Hủy navigation hiện tại
    })
  );
};
