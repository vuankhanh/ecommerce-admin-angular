import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreakpointDetectionService } from '../../../../service/breakpoint-detection.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { MediaProductCategoryService, TAlbumProductCategory } from '../../../../service/api/media-product-category.service';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    PrefixBackendStaticPipe,

    MaterialModule
  ],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.scss'
})
export class ProductCategoryComponent {
  searchTerm: string = '';
  private readonly bSearchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
  breakpointDetection$ = this.breakpointDetectionService.detection$();

  productCategories$: Observable<TAlbumProductCategory> = this.bSearchTerm.pipe(
    switchMap(term => this.mediaProductCategoryService.getAll(term))
  );
  
  constructor(
    private router: Router,
    private readonly breakpointDetectionService: BreakpointDetectionService,
    private readonly mediaProductCategoryService: MediaProductCategoryService
  ) { }

  onSearch() {
    console.log(`Searching for: ${this.searchTerm}`);
    this.bSearchTerm.next(this.searchTerm);
  }

  createProductCategory() {
    this.router.navigate(['dashboard/media/product-category/create']);
  }

  productCategoryDetail(id: string) {
    this.router.navigate(['dashboard/media/product-category', id]);
  }
}
