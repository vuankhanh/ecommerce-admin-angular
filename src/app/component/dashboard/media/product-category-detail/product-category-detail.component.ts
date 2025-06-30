import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FileDragAndDropComponent } from '../../../../shared/component/file-drag-and-drop/file-drag-and-drop.component';
import { CommonModule } from '@angular/common';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { Observable, Subscription, switchMap } from 'rxjs';
import { TAlbumModel, TMediaModel } from '../../../../shared/interface/album.interface';
import { IFileUpload } from '../../../../shared/interface/file-upload.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GalleryCustomThumbsComponent } from '../../../../shared/component/gallery-custom-thumbs/gallery-custom-thumbs.component';
import { GalleryItemTemporarilyDeletedComponent } from '../../../../shared/component/gallery-item-temporarily-deleted/gallery-item-temporarily-deleted.component';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { IGalleryItem } from '../../../../shared/interface/gallery.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaProductCategoryService } from '../../../../service/api/media-product-category.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material';
import { fileValidator } from '../../../../shared/utitl/form-validator/files_array.validator';

@Component({
  selector: 'app-product-category-detail',
  standalone: true,
  imports: [
    CommonModule,

    ReactiveFormsModule,

    MatButtonModule,
    MatIconModule,

    PrefixBackendStaticPipe,

    FileDragAndDropComponent,
    GalleryCustomThumbsComponent,
    GalleryItemTemporarilyDeletedComponent,

    MaterialModule
  ],
  templateUrl: './product-category-detail.component.html',
  styleUrl: './product-category-detail.component.scss'
})
export class ProductCategoryDetailComponent {
  @ViewChild(FileDragAndDropComponent) childComponentRef!: FileDragAndDropComponent;
  @ViewChild(GalleryComponent, { read: ElementRef }) galleryComponent!: ElementRef;

  private readonly id = this.activatedRoute.snapshot.paramMap.get('id') as string;

  mediaProductCategory?: TAlbumModel
  galleryItems: IGalleryItem[] = [];
  galleryItemTemporarilyDeleted: IGalleryItem[] = [];

  galleryItemIndexChanged: string[] = [];

  imageMIMETypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  formGroup: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    file: this.formBuilder.group({
      file: [null, [Validators.required]],
      description: [''],
      alternateName: [''],
      isMain: [false]
    }, { validators: [Validators.required, fileValidator] })
  });

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private readonly router: Router,
    private activatedRoute: ActivatedRoute,
    private mediaProductCategoryService: MediaProductCategoryService,
    private prefixBackendStaticPipe: PrefixBackendStaticPipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!this.id) {
      console.error('Id của danh mục sản phẩm không hợp lệ');
      return;
    }
    this.subscription.add(
      this.mediaProductCategoryService.getDetail(this.id).subscribe((res) => {
        this.mediaProductCategory = res;

        this.formGroup.removeControl('name');
        this.initImages(this.mediaProductCategory.media);
      })
    )
  }

  handleFilesUploaded(fileUploads: IFileUpload[]): void {
    const fileUpload = fileUploads[0];
    const valuePatch = fileUpload ? {
      file: fileUpload.file,
      description: fileUpload.description || '',
      alternateName: fileUpload.alternateName || '',
      isMain: fileUpload.isMain || false
    } : {
      file: null,
      description: '',
      alternateName: '',
      isMain: false
    }

    this.formGroup.get('file')?.patchValue(valuePatch);

    this.cdr.detectChanges();
  }

  uploadFiles(): void {
    if (this.formGroup.valid) {
      const name = this.formGroup.get('name')?.value;
      const file = this.formGroup.get('file')?.value;
      if (!this.mediaProductCategory) {
        this.subscription.add(
          this.createRequest(name, file).subscribe(res => {
            this.router.navigate(['/dashboard/media/product-category', res._id]);
          })
        );
      } else {
        this.subscription.add(
          this.updateAddNewFilesRequest(this.id, file).subscribe((res) => {
            this.childComponentRef.reset();
            this.mediaProductCategory = res;
            this.formGroup.removeControl('name');
            this.initImages(this.mediaProductCategory.media);
          })
        )
      }
    }
  }

  private createRequest(name: string, fileItem: IFileUpload): Observable<TAlbumModel> {
    return this.mediaProductCategoryService.create(name, fileItem);
  }

  private updateAddNewFilesRequest(id: string, fileItem: IFileUpload): Observable<TAlbumModel> {
    return this.mediaProductCategoryService.addNewFiles(id, fileItem);
  }

  private initImages(medias: Array<TMediaModel>): Array<IGalleryItem> {
    medias = medias.filter(media => media);
    this.galleryItems = medias.map(media => {
      const src = this.prefixBackendStaticPipe.transform(media.url);
      const thumbSrc = this.prefixBackendStaticPipe.transform(media.thumbnailUrl);
      const galleryItem: IGalleryItem = {
        _id: media._id!,
        src,
        thumbSrc,
        alt: media.alternateName,
        description: media.description,
        video: media.type === 'video' ? true : false
      }
      return galleryItem;
    });

    return this.galleryItems;
  }

  handleItemTemporaryDeletion(index: number): void {
    const item = this.galleryItems[index];
    this.galleryItemTemporarilyDeleted.push(item);
    this.galleryItems.splice(index, 1);
    this.galleryItems = [...this.galleryItems];
  }

  handleitemIndexChanged(galleryItems: Array<IGalleryItem>): void {
    this.galleryItemIndexChanged = galleryItems.map((item) => item._id)
  }

  onGalleryItemRestore(item: IGalleryItem): void {
    this.galleryItems = [...this.galleryItems, item];
  }

  update() {
    const filesWillRemove = this.galleryItemTemporarilyDeleted.map(item => item._id);
    const galleryItemIndexChanged = this.galleryItemIndexChanged;
    this.subscription.add(
      this.updateRequest(filesWillRemove, galleryItemIndexChanged).subscribe((res) => {
        this.mediaProductCategory = res;
        this.galleryItemTemporarilyDeleted = [];
        this.galleryItemIndexChanged = [];
      })
    )
  }

  private updateRequest(filesWillRemove: Array<string>, galleryItemIndexChanged: Array<string>): Observable<TAlbumModel> {
    if (filesWillRemove.length > 0 && galleryItemIndexChanged.length > 0) {
      return this.updateRemoveFilesRequest(filesWillRemove).pipe(
        switchMap(() => this.updateItemIndexChangeRequest(galleryItemIndexChanged))
      )
    } else {
      if (filesWillRemove.length > 0) {
        return this.updateRemoveFilesRequest(filesWillRemove);
      }
      if (galleryItemIndexChanged.length > 0) {
        return this.updateItemIndexChangeRequest(galleryItemIndexChanged);
      }
      return new Observable<TAlbumModel>();
    }
  }

  private updateRemoveFilesRequest(filesWillRemove: Array<string>) {
    return this.mediaProductCategoryService.removeFiles(this.id, filesWillRemove);
  }

  private updateItemIndexChangeRequest(galleryItemIndexChanged: Array<string>) {
    return this.mediaProductCategoryService.itemIndexChange(this.id, galleryItemIndexChanged)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
