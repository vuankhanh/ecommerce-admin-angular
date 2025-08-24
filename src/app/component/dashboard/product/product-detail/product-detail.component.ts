import { Component, OnDestroy, OnInit } from '@angular/core';
import { TProductModel } from '../../../../shared/interface/product.interface';
import { ProductService } from '../../../../service/api/product.service';
import { filter, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material';
import { HeaderPageContainerComponent } from '../../../../shared/component/header-page-container/header-page-container.component';
import { Title } from '@angular/platform-browser';
import { CurrencyCustomPipe } from '../../../../shared/pipe/currency-custom.pipe';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { GalleryPipe } from '../../../../shared/pipe/gallery.pipe';
import { ConfirmationDialogData } from '../../../../shared/interface/confirmation-dialog.interface';
import { ConfirmationDialogComponent } from '../../../../shared/component/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailSkeletonComponent } from '../../../../shared/component/loading/product-detail-skeleton/product-detail-skeleton.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,

    ProductDetailSkeletonComponent,
    GalleryComponent,
    HeaderPageContainerComponent,
    CurrencyCustomPipe,
    GalleryPipe,

    MaterialModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product?: TProductModel;

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly title: Title,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.subscription.add(
        this.productService.getDetail(id).subscribe({
          next: (res) => {
            this.product = res;
            this.title.setTitle(`${this.product.name['vi']}`);
          },
          error: (err) => {
            console.error('Error fetching product details:', err);
            this.goBackProduct();
          },
          complete: () => {
            console.log('Product details fetched successfully');
          }
        })
      );
    }
  }

  goBackProduct() {
    this.router.navigate(['dashboard/product']);
  }

  onEditProduct() {
    if (this.product) {
      this.router.navigate(['/dashboard/product/edit', this.product._id]);
    } else {
      this.goBackProduct();
    }
  }

  onDeleteProduct() {
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
        switchMap(_ => this.productService.remove(this.product!._id))
      ).subscribe({
        next: () => {
          this.goBackProduct();
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
