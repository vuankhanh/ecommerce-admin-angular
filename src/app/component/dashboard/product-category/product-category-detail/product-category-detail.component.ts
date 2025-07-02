import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Subscription, switchMap } from 'rxjs';
import { MaterialModule } from '../../../../shared/modules/material';
import { ProductCategoryService } from '../../../../service/api/product-category.service';
import { TProductCategoryModel } from '../../../../shared/interface/product-category.interface';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { HeaderPageContainerComponent } from '../../../../shared/component/header-page-container/header-page-container.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/component/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../../../shared/interface/confirmation-dialog.interface';

@Component({
  selector: 'app-product-category-detail',
  standalone: true,
  imports: [
    CommonModule,

    PrefixBackendStaticPipe,

    HeaderPageContainerComponent,
    ConfirmationDialogComponent,

    MaterialModule
  ],
  templateUrl: './product-category-detail.component.html',
  styleUrl: './product-category-detail.component.scss'
})
export class ProductCategoryDetailComponent implements OnInit, OnDestroy {
  productCategory: TProductCategoryModel | null = null;
  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly productCategoryService: ProductCategoryService,
    private title: Title,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (!id) {
      console.error('Product category ID is required');
      return;
    }
    this.subscription.add(
      this.productCategoryService.getDetail(id).subscribe({
        next: (res) => {
          this.productCategory = res;
          this.title.setTitle(this.productCategory.name);
        },
        error: (err) => {
          console.error('Error fetching product category detail:', err);
          this.goBackProducCategory();
        },
        complete: () => {
          console.log('Product category detail fetched successfully');
        }
      })
    );
  }

  goBackProducCategory() {
    this.router.navigate(['/dashboard/product-category/list']);
  }

  onEditProductCategory() {
    if (this.productCategory) {
      this.router.navigate(['/dashboard/product-category/edit', this.productCategory._id]);
    } else {
      this.goBackProducCategory();
    }
  }

  onDeleteProductCategory() {
    const data: ConfirmationDialogData = {
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      type: 'danger'
    }

    this.subscription.add(
      this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        maxWidth: '90vw',
        data: data,
        disableClose: true,
        panelClass: 'confirmation-dialog'
      }).afterClosed().pipe(
        filter((confirmed: boolean) => confirmed),
        switchMap(_ =>this.productCategoryService.remove(this.productCategory!._id))
      ).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/product-category/list']);
        },
        error: (err) => {
          console.error('Error deleting product category:', err);
        },
        complete: () => {
          console.log('Product category deleted successfully');
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
