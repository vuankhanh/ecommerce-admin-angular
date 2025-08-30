import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material';
import { MatInput } from '@angular/material/input';
import { BehaviorSubject, map, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { TProductCategoryModel } from '../../../../shared/interface/product-category.interface';
import { TAlbumModel } from '../../../../shared/interface/album.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategoryService } from '../../../../service/api/product-category.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ChooseMediaProductCategoryComponent } from '../../../../shared/component/choose-media-product-category/choose-media-product-category.component';
import { HeaderPageContainerComponent } from '../../../../shared/component/header-page-container/header-page-container.component';

@Component({
  selector: 'app-product-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    HeaderPageContainerComponent,
    ChooseMediaProductCategoryComponent,

    MaterialModule
  ],
  templateUrl: './product-category-form.component.html',
  styleUrl: './product-category-form.component.scss'
})
export class ProductCategoryFormComponent implements OnInit, OnDestroy {
  @ViewChild('productCategoryEl') productCategoryEl!: ElementRef<MatInput>;
  @ViewChild(ChooseMediaProductCategoryComponent) chooseMediaProductCategoryComponent!: ChooseMediaProductCategoryComponent;

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
    name: this.formBuilder.group({
      vi: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      en: ['', [Validators.minLength(1), Validators.maxLength(100)]],
      ja: ['', [Validators.minLength(1), Validators.maxLength(100)]],
    }),
    albumId: [''],
    description: this.formBuilder.group({
      vi: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      en: ['', [Validators.minLength(10), Validators.maxLength(1000)]],
      ja: ['', [Validators.minLength(10), Validators.maxLength(1000)]],
    }),
    parentId: [''],
    isActive: [true, Validators.required]
  });

  private readonly bControlFormChanged: BehaviorSubject<{ [key: string]: any }> = new BehaviorSubject<{ [key: string]: any }>({});
  private readonly controlFormChanged$: Observable<{ [key: string]: any }> = this.bControlFormChanged.asObservable();
  isFormChanged$: Observable<boolean> = this.controlFormChanged$.pipe(
    map((value: { [key: string]: any }) => {
      return Object.keys(value).length > 0;
    }),
  );

  productCategory?: TProductCategoryModel;

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productCategoryService: ProductCategoryService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.productCategoryService.getDetail(id).subscribe({
        next: (res) => {
          this.productCategory = res;
          this.initForm(this.productCategory);
        },
        error: () => {
          this.goBackProducCategoryDetail();
        }
      })
    }
  }

  private initForm(productCategory?: TProductCategoryModel) {
    if (productCategory) {
      this.formGroup.patchValue({
      name: {
        vi: productCategory.name['vi'] || '',
        en: productCategory.name['en'] || '',
        ja: productCategory.name['ja'] || '',
      },
      description: {
        vi: productCategory.description?.['vi'] || '',
        en: productCategory.description?.['en'] || '',
        ja: productCategory.description?.['ja'] || '',
      },
      albumId: productCategory.albumId || '',
      parentId: productCategory.parentId || '',
      isActive: productCategory.isActive ?? true
    });
    }

    this.subscription.add(
      this.formGroup.valueChanges.subscribe((value) => {
        //Lấy ra các control đã thay đổi
        const changedControls: { [key: string]: any } = {};
        Object.keys(value).forEach(key => {
          if (!this.productCategory) return;
          if (value[key] !== this.productCategory[key as keyof TProductCategoryModel]) {
            if (value[key] === '') return;
            changedControls[key] = value[key];
          }
        });

        this.bControlFormChanged.next(changedControls);
      })
    )
  }

  handleMediaProductCategory(album: TAlbumModel | null) {
    this.formGroup.get('albumId')?.setValue(album?._id);
    const nameControl = this.formGroup.get('name');
    if (nameControl && !nameControl.value) {
      nameControl.setValue(album?.name);
    }
  }

  onProductCategoryBlur() {
    const productCategorySelectedName = this.productCategorySelected?.name;
    this.productCategoryEl.nativeElement.value = productCategorySelectedName ? productCategorySelectedName : '';
  }

  onCategoryOptionSelected(event: MatAutocompleteSelectedEvent) {
    const productCategory: TProductCategoryModel = event.option.value;
    this.productCategorySelected = productCategory;
    this.productCategoryEl.nativeElement.value = productCategory.name;
    this.formGroup.get('parentId')?.setValue(productCategory._id);
  }

  private create() {
    return this.productCategoryService.create(this.formGroup.value)
  }

  private update() {
    return this.controlFormChanged$.pipe(
      switchMap((changedControls: { [key: string]: any }) => {
        return this.productCategoryService.update(this.productCategory!._id, changedControls)
      })
    )
  }

  onSubmit() {
    const api$ = this.productCategory?._id ? this.update() : this.create();
    this.subscription.add(
      api$.subscribe({
        next: res => {
          this.productCategory = res;
          this.goBackProducCategoryDetail();
        },
        error: error => {
          console.error(error);
        }
      })
    )
  }

  goBackProducCategoryDetail() {
    const commands = this.productCategory?._id ? ['/dashboard/product-category/detail', this.productCategory?._id] : ['/dashboard/product-category'];
    this.router.navigate(commands);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
