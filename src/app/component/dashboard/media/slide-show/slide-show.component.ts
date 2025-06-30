import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileDragAndDropComponent } from '../../../../shared/component/file-drag-and-drop/file-drag-and-drop.component';
import { BehaviorSubject, catchError, map, Observable, of, Subscription, switchMap, take, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IFileUpload } from '../../../../shared/interface/file-upload.interface';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { GalleryCustomThumbsComponent } from '../../../../shared/component/gallery-custom-thumbs/gallery-custom-thumbs.component';
import { GalleryItemTemporarilyDeletedComponent } from '../../../../shared/component/gallery-item-temporarily-deleted/gallery-item-temporarily-deleted.component';
import { IGalleryItem } from '../../../../shared/interface/gallery.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { TAlbumModel, TMediaModel } from '../../../../shared/interface/album.interface';
import { MediaSlideShowService } from '../../../../service/api/media-slide-show.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material';
import { filesArrayValidator, fileValidator } from '../../../../shared/utitl/form-validator/files_array.validator';

@Component({
  selector: 'app-slide-show',
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
  providers: [
    PrefixBackendStaticPipe
  ],
  templateUrl: './slide-show.component.html',
  styleUrl: './slide-show.component.scss'
})
export class SlideShowComponent implements OnInit, OnDestroy {
  @ViewChild(FileDragAndDropComponent) childComponentRef!: FileDragAndDropComponent;
  @ViewChild(GalleryComponent, { read: ElementRef }) galleryComponent!: ElementRef;

  slideShow?: TAlbumModel
  galleryItems: IGalleryItem[] = [];
  galleryItemTemporarilyDeleted: IGalleryItem[] = [];

  galleryItemIndexChanged: string[] = [];

  imageMIMETypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/webm'];

  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  formGroup: FormGroup = this.formBuilder.group({
    files: this.formBuilder.array([], { validators: [Validators.required, filesArrayValidator] })
  });

  private get filesFormArray(): FormArray {
    return this.formGroup.get('files') as FormArray;
  }

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private mediaSlideShowService: MediaSlideShowService,
    private prefixBackendStaticPipe: PrefixBackendStaticPipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.mediaSlideShowService.get().subscribe((res) => {
        this.slideShow = res;
        this.initImages(this.slideShow.media);
      })
    )
  }

  handleFilesUploaded(fileUploads: IFileUpload[]): void {
    console.log(fileUploads);

    const valuePatch = fileUploads.map(fileUpload => {
      return {
        file: fileUpload.file,
        description: fileUpload.description || '',
        alternateName: fileUpload.alternateName || '',
        isMain: fileUpload.isMain || false
      }
    });


    this.filesFormArray.clear();

    // Thêm các FormControl mới
    valuePatch.forEach(value => {
      const formControl = this.formBuilder.group({
        file: [value.file, [Validators.required, fileValidator]],
        description: [value.description],
        alternateName: [value.alternateName],
        isMain: [value.isMain]
      });
      this.filesFormArray.push(formControl);
    });

    this.cdr.detectChanges();
  }

  uploadFiles(): void {
    if (this.formGroup.valid) {
      const fileUploads: IFileUpload[] = this.filesFormArray.value.map((file: any) => {
        return {
          file: file.file,
          description: file.description || '',
          alternateName: file.alternateName || '',
          isMain: file.isMain || false
        };
      });
      const api = this.slideShow ? this.updateAddNewFilesRequest(fileUploads) : this.createRequest(fileUploads);
      this.subscription.add(
        api.subscribe((res) => {
          this.childComponentRef.reset();
          this.slideShow = res;
          this.initImages(this.slideShow.media);
        })
      )
    }
  }

  private createRequest(fileUploads: IFileUpload[]): Observable<TAlbumModel> {
    return this.mediaSlideShowService.create(fileUploads);
  }

  private updateAddNewFilesRequest(fileUploads: IFileUpload[]): Observable<TAlbumModel> {
    return this.mediaSlideShowService.addNewFiles(fileUploads);
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
        this.slideShow = res;
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
    return this.mediaSlideShowService.removeFiles(filesWillRemove);
  }

  private updateItemIndexChangeRequest(galleryItemIndexChanged: Array<string>) {
    return this.mediaSlideShowService.itemIndexChange(galleryItemIndexChanged)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
