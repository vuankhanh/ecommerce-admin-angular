import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BreakpointDetectionService } from '../../../../service/breakpoint-detection.service';
import { Router } from '@angular/router';
import { Observable, startWith, switchMap } from 'rxjs';
import { MediaProductCategoryService, TAlbumProductCategory } from '../../../../service/api/media-product-category.service';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    PrefixBackendStaticPipe,

    MaterialModule
  ],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.scss'
})
export class ProductCategoryComponent {
  searchControl = new FormControl<string>('');

  productCategories$: Observable<TAlbumProductCategory> = this.searchControl.valueChanges.pipe(
    startWith(''),
    switchMap(term => this.mediaProductCategoryService.getAll(term ? term : ''))
  );

  isMobile$ = this.breakpointDetectionService.isMobile$;

  constructor(
    private router: Router,
    private readonly breakpointDetectionService: BreakpointDetectionService,
    private readonly mediaProductCategoryService: MediaProductCategoryService
  ) { }

  createProductCategory() {
    this.router.navigate(['dashboard/media/product-category/create']);
  }

  productCategoryDetail(id: string) {
    this.router.navigate(['dashboard/media/product-category', id]);
  }
}
