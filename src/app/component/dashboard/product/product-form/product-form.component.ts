import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TProductModel } from '../../../../shared/interface/product.interface';
import { BehaviorSubject, map, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../service/api/product.service';
import { TAlbumModel } from '../../../../shared/interface/album.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ProductCategoryService } from '../../../../service/api/product-category.service';
import { MatInput } from '@angular/material/input';
import { TProductCategoryModel } from '../../../../shared/interface/product-category.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HeaderPageContainerComponent } from '../../../../shared/component/header-page-container/header-page-container.component';
import { ChooseMediaProductComponent } from '../../../../shared/component/choose-media-product/choose-media-product.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    ChooseMediaProductComponent,
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
export class ProductFormComponent implements OnInit, OnDestroy {
  @ViewChild('productCategoryEl') productCategoryEl!: ElementRef<MatInput>;

  private readonly bBroductCategoryEl: BehaviorSubject<string> = new BehaviorSubject<string>('');

  productCategory$: Observable<TProductCategoryModel[]> = this.productCategoryService.getAllData().pipe(
    switchMap((productCategoriese: TProductCategoryModel[]) => {
      return this.bBroductCategoryEl.pipe(
        startWith(''),
        map((value: string) => {
          const filterValue = value.toLowerCase();
          return productCategoriese.filter((productCategory: TProductCategoryModel) => {
            return productCategory.name['vi'].toLowerCase().includes(filterValue);
          });
        }),
      )
    })
  );

  private productCategorySelected: TProductCategoryModel | null = null;

  formGroup: FormGroup = this.formBuilder.group({
    // Thông tin sản phẩm cơ bản
    name: this.formBuilder.group({
      vi: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      en: ['', [Validators.minLength(1), Validators.maxLength(100)]],
      ja: ['', [Validators.minLength(1), Validators.maxLength(100)]],
    }),
    description: this.formBuilder.group({
      vi: ['', [Validators.required, Validators.minLength(10)]],
      en: ['', [Validators.minLength(10), Validators.maxLength(10000)]],
      ja: ['', [Validators.minLength(10), Validators.maxLength(10000)]],
    }),
    shortDescription: this.formBuilder.group({
      vi: ['', [Validators.required, Validators.minLength(10)]],
      en: ['', [Validators.minLength(10), Validators.maxLength(1000)]],
      ja: ['', [Validators.minLength(10), Validators.maxLength(1000)]],
    }),

    // Hình ảnh
    albumId: [''],

    // Giá và tồn kho
    price: [0, [Validators.required, Validators.min(0.01)]],
    inStock: [true, [Validators.required]],

    // Phân loại
    productCategoryId: [''],
  });

  private readonly bControlFormChanged: BehaviorSubject<{ [key: string]: any }> = new BehaviorSubject<{ [key: string]: any }>({});
  private readonly controlFormChanged$: Observable<{ [key: string]: any }> = this.bControlFormChanged.asObservable();
  isFormChanged$: Observable<boolean> = this.controlFormChanged$.pipe(
    map((value: { [key: string]: any }) => {
      return Object.keys(value).length > 0;
    }),
  );

  product?: TProductModel;

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    // private albumService: AlbumService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getDetail(id).subscribe({
        next: (res) => {
          this.product = res;
          this.initForm(this.product);
        },
        error: () => {
          this.goBackProducDetail();
        }
      })
    }
  }

  private initForm(product?: TProductModel) {
    if (product) {
      this.formGroup.patchValue({
        name: {
          vi: product.name['vi'] || '',
          en: product.name['en'] || '',
          ja: product.name['ja'] || '',
        },
        description: {
          vi: product.description?.['vi'] || '',
          en: product.description?.['en'] || '',
          ja: product.description?.['ja'] || '',
        },
        shortDescription: {
          vi: product.shortDescription?.['vi'] || '',
          en: product.shortDescription?.['en'] || '',
          ja: product.shortDescription?.['ja'] || '',
        },
        albumId: product.albumId || '',
        price: product.price || 0,
        inStock: product.inStock !== undefined ? product.inStock : true,
        productCategoryId: product.productCategoryId || '',
      });
    }

    this.subscription.add(
      this.formGroup.valueChanges.subscribe((value) => {
        //Lấy ra các control đã thay đổi
        const changedControls: { [key: string]: any } = {};
        Object.keys(value).forEach(key => {
          if (!this.product) return;
          if (value[key] !== this.product[key as keyof TProductModel]) {
            if (value[key] === '') return;
            changedControls[key] = value[key];
          }
        });

        this.bControlFormChanged.next(changedControls);
      })
    )
  }

  handleMediaProduct(album: TAlbumModel | null) {
    this.formGroup.get('albumId')?.setValue(album?._id);
    const nameControl = this.formGroup.get('name');
    if (nameControl && !nameControl.value) {
      nameControl.setValue(album?.name);
    }
  }

  onProductCategoryBlur() {
    const productCategorySelectedName = this.productCategorySelected?.name['vi'];
    this.productCategoryEl.nativeElement.value = productCategorySelectedName ? productCategorySelectedName : '';
  }

  onCategoryOptionSelected(event: MatAutocompleteSelectedEvent) {
    const productCategory: TProductCategoryModel = event.option.value;
    this.productCategorySelected = productCategory;
    this.productCategoryEl.nativeElement.value = productCategory.name['vi'];
    this.formGroup.get('productCategoryId')?.setValue(productCategory._id);
  }

  private create() {
    return this.productService.create(this.formGroup.value)
  }

  private update() {
    return this.controlFormChanged$.pipe(
      switchMap((changedControls: { [key: string]: any }) => {
        return this.productService.update(this.product!._id, changedControls)
      })
    )
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

  goBackProducDetail() {
    const commands = this.product?._id ? ['/dashboard/product/detail', this.product?._id] : ['/dashboard/product/list'];
    this.router.navigate(commands);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
