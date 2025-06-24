import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GalleryComponent, GalleryItem } from '@daelmaak/ngx-gallery';
import { IProduct, TProductModel } from '../../../../shared/interface/product.interface';
import { map, of, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../../../service/api/product.service';
import { AlbumService, DetailParams } from '../../../../service/api/album.service';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { TAlbumModel } from '../../../../shared/interface/album.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    GalleryComponent,

    MaterialModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  title!: string;
  formGroup!: FormGroup;

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
    private albumService: AlbumService
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
      name: [this.product?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [this.product?.description || '', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      shortDescription: [this.product?.shortDescription || '', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      albumId: [this.product?.albumId || ''],
      price: [this.product?.price || 0, [Validators.required, Validators.min(0.01)]],
      category: [this.product?.category || '', [Validators.required]],
      stock: [this.product?.stock || 0, [Validators.required, Validators.min(0)]],
      tags: [this.product?.tags || []],
      metaTitle: [this.product?.metaTitle || ''],
      metaDescription: [this.product?.metaDescription || ''],
      metaKeywords: [this.product?.metaKeywords || []]
    });
  }

  isFormChanged(): boolean {
    return this.formGroup.dirty && !this.formGroup.pristine;
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
    const detailParams: DetailParams = {
      id: albumId
    }
    this.subscription.add(
      this.albumService.getDetail(detailParams).subscribe({
        next: res => {
          this.album = res;
          const galleryItems: GalleryItem[] = res.media.map(media => {
            return {
              src: this.prefixBackendStaticPipe.transform(media.url),
              thumbSrc: this.prefixBackendStaticPipe.transform(media.thumbnailUrl),
              text: media.caption,
              video: media.type === 'video' ? true : false
            }
          })
          this.galleryItems = galleryItems;
          console.log(this.galleryItems);

        },
        error: error => {
          console.error(error);
        }
      })
    )
  }

  goBackProducDetail() {
    const commands = this.product?._id ? ['/product', this.product?._id] : ['/product'];
    this.router.navigate(commands);
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
