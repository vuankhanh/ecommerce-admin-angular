import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GalleryComponent, GalleryItem } from '@daelmaak/ngx-gallery';
import { TProductModel } from '../../../../shared/interface/product.interface';
import { BehaviorSubject, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../../../service/api/product.service';
// import { AlbumService, DetailParams } from '../../../../service/api/media-slide-show.service';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { TAlbumModel } from '../../../../shared/interface/album.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ProductCategoryService } from '../../../../service/api/product-category.service';
import { MatInput } from '@angular/material/input';
import { TProductCategoryModel } from '../../../../shared/interface/product-category.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HeaderPageContainerComponent } from '../../../../shared/component/header-page-container/header-page-container.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    GalleryComponent,
    HeaderPageContainerComponent,

    NgxMaskDirective,

    MaterialModule
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  @ViewChild('productCategoryEl') productCategoryEl!: ElementRef<MatInput>;
  formGroup!: FormGroup;
  private readonly bBroductCategoryEl: BehaviorSubject<string> = new BehaviorSubject<string>('');

  productCategory$: Observable<TProductCategoryModel[]> = this.productCategoryService.getAllData().pipe(
    switchMap((productCategoriese: TProductCategoryModel[]) => {
      return this.bBroductCategoryEl.pipe(
        startWith(''),
        map((value: string) => {
          const filterValue = value.toLowerCase();
          return productCategoriese.filter((productCategory: TProductCategoryModel) => {
            return productCategory.name.toLowerCase().includes(filterValue);
          });
        }),
      )
    })
  );

  private productCategorySelected: TProductCategoryModel | null = null;

  album?: TAlbumModel;
  galleryItems: GalleryItem[] = [];

  product?: TProductModel;

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private prefixBackendStaticPipe: PrefixBackendStaticPipe,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    // private albumService: AlbumService
  ) { }

  ngOnInit() {
    this.subscription.add(
      this.activatedRoute.queryParamMap.pipe(
        map(params => params.get('_id')),
        switchMap(customerId => !!customerId ? this.productService.getDetail(customerId) : of(null))
      ).subscribe({
        next: (res) => {
          if (res) {
            this.product = res;
            if (this.product.albumId) {
              this.getAlbumDetail(this.product.albumId);
            }
          }
          this.initForm();
        },
        error: error => {
          this.goBackProducDetail();
        }
      })
    )
  }

  private initForm() {
    this.formGroup = this.formBuilder.group({
      // Thông tin sản phẩm cơ bản
      name: [this.product?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [this.product?.description || '', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      shortDescription: [this.product?.shortDescription || '', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],

      // Hình ảnh
      albumId: [this.product?.albumId || ''],

      // Giá và tồn kho
      price: [this.product?.price || 0, [Validators.required, Validators.min(0.01)]],
      stock: [this.product?.stock || 0, [Validators.required, Validators.min(0)]],

      // Phân loại
      category: [this.product?.category || '', [Validators.required]],
    });
  }

  isFormChanged(): boolean {
    return this.formGroup.dirty && !this.formGroup.pristine;
  }

  onProductCategoryBlur(event: FocusEvent) {
    const productCategorySelectedName = this.productCategorySelected?.name;
    this.productCategoryEl.nativeElement.value = productCategorySelectedName ? productCategorySelectedName : '';
  }

  onCategoryOptionSelected(event: MatAutocompleteSelectedEvent) {
    const productCategory: TProductCategoryModel = event.option.value;
    this.productCategorySelected = productCategory;
    this.productCategoryEl.nativeElement.value = productCategory.name;
    this.formGroup.get('category')?.setValue(productCategory);
  }

  private create() {
    return this.productService.create(this.formGroup.value)
  }

  private update() {
    const changedControls: { [key: string]: any } = {};
    Object.keys(this.formGroup.controls).forEach(key => {
      const control = this.formGroup.get(key);
      if (control?.dirty) {
        changedControls[key] = control.value;
      }
    });

    return this.productService.update(this.product!._id, changedControls)
  }

  onSubmit() {
    const api$ = this.product?._id ? this.update() : this.create();
    this.subscription.add(
      api$.subscribe({
        next: res => {
          this.product = res;
          this.goBackProducDetail();
        },
        error: error => {
          console.error(error);
        }
      })
    )
  }

  openAlbumDialog() {
    // const dialogRef = this.dialog.open(AlbumShowComponent, {
    //   width: '800px'
    // });
    // this.subscription.add(
    //   dialogRef.afterClosed().subscribe((result: TAlbumModel) => {
    //     if (result) {
    //       console.log(result);
    //       this.formGroup.get('albumId')?.setValue(result._id);
    //       this.formGroup.get('albumId')?.markAsDirty();
    //       this.getAlbumDetail(result._id);
    //     }
    //   })
    // )
  }

  private getAlbumDetail(albumId: string) {
    // const detailParams: DetailParams = {
    //   id: albumId
    // }
    // this.subscription.add(
    //   this.albumService.getDetail(detailParams).subscribe({
    //     next: res => {
    //       this.album = res;
    //       const galleryItems: GalleryItem[] = res.media.map(media => {
    //         return {
    //           src: this.prefixBackendStaticPipe.transform(media.url),
    //           thumbSrc: this.prefixBackendStaticPipe.transform(media.thumbnailUrl),
    //           text: media.caption,
    //           video: media.type === 'video' ? true : false
    //         }
    //       })
    //       this.galleryItems = galleryItems;
    //       console.log(this.galleryItems);

    //     },
    //     error: error => {
    //       console.error(error);
    //     }
    //   })
    // )
  }

  goBackProducDetail() {
    const commands = this.product?._id ? ['/product', this.product?._id] : ['/product'];
    this.router.navigate(commands);
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
