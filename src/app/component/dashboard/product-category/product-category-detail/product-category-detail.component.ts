import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../../../shared/modules/material';
import { ProductCategoryService } from '../../../../service/api/product-category.service';
import { TProductCategoryModel } from '../../../../shared/interface/product-category.interface';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';

@Component({
  selector: 'app-product-category-detail',
  standalone: true,
  imports: [
    CommonModule,

    PrefixBackendStaticPipe,

    MaterialModule
  ],
  templateUrl: './product-category-detail.component.html',
  styleUrl: './product-category-detail.component.scss'
})
export class ProductCategoryDetailComponent implements OnInit, OnDestroy {
  productCategory: TProductCategoryModel | null = null;
  private readonly subscription: Subscription = new Subscription();
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly productCategoryService: ProductCategoryService,
    private title: Title
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (!id) {
      console.error('Product category ID is required');
      return;
    }
    this.subscription.add(
      this.productCategoryService.getDetail(id).subscribe(res => {
        this.productCategory = res;
        this.title.setTitle(this.productCategory.name);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
