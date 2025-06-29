import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { MediaProductCategoryService } from '../../../../service/api/media-product-category.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material';

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

  mediaProductCategory?: TAlbumModel
  galleryItems: IGalleryItem[] = [];
  galleryItemTemporarilyDeleted: IGalleryItem[] = [];

  galleryItemIndexChanged: string[] = [];

  imageMIMETypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private activatedRoute: ActivatedRoute,
    private mediaProductCategoryService: MediaProductCategoryService,
    private prefixBackendStaticPipe: PrefixBackendStaticPipe,
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    if (!id) {
      console.error('Id của danh mục sản phẩm không hợp lệ');
      return;
    }
    this.subscription.add(
      this.mediaProductCategoryService.getDetail(id).subscribe((res) => {
        this.mediaProductCategory = res;
        this.initImages(this.mediaProductCategory.media);
      })
    )
  }

  handleFilesUploaded(fileUploads: IFileUpload[]): void {
    const fileUpload = fileUploads[0];
    console.log(fileUpload);
    
    // const api = this.mediaProductCategory ? this.updateAddNewFilesRequest(fileUpload) : this.createRequest(fileUpload);
    // this.subscription.add(
    //   api.subscribe((res) => {
    //     this.childComponentRef.reset();
    //     this.mediaProductCategory = res;
    //     this.initImages(this.mediaProductCategory.media);
    //   })
    // )
  }

  private createRequest(fileItem: IFileUpload): Observable<TAlbumModel> {
    return this.mediaProductCategoryService.create(fileItem);
  }

  private updateAddNewFilesRequest(fileItem: IFileUpload): Observable<TAlbumModel> {
    return this.mediaProductCategoryService.addNewFiles(fileItem);
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
    return this.mediaProductCategoryService.removeFiles(filesWillRemove);
  }

  private updateItemIndexChangeRequest(galleryItemIndexChanged: Array<string>) {
    return this.mediaProductCategoryService.itemIndexChange(galleryItemIndexChanged)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
