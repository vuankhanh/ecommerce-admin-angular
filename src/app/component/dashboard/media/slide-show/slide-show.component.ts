import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileDragAndDropComponent } from '../../../../shared/component/file-drag-and-drop/file-drag-and-drop.component';
import { BehaviorSubject, catchError, map, Observable, of, Subscription, switchMap, take, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IRequestParamsWithFiles } from '../../../../shared/interface/request.interface';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { GalleryCustomThumbsComponent } from '../../../../shared/component/gallery-custom-thumbs/gallery-custom-thumbs.component';
import { GalleryItemTemporarilyDeletedComponent } from '../../../../shared/component/gallery-item-temporarily-deleted/gallery-item-temporarily-deleted.component';
import { IGalleryItem } from '../../../../shared/interface/gallery.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { TAlbumModel, TMediaModel } from '../../../../shared/interface/album.interface';
import { SlideShowService } from '../../../../service/api/media-slide-show.service';

@Component({
  selector: 'app-slide-show',
  standalone: true,
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,

    PrefixBackendStaticPipe,

    FileDragAndDropComponent,
    GalleryCustomThumbsComponent,
    GalleryItemTemporarilyDeletedComponent
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

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private slideShowService: SlideShowService,
    private prefixBackendStaticPipe: PrefixBackendStaticPipe,
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.slideShowService.get().subscribe((res) => {
        this.slideShow = res;
        this.initImages(this.slideShow.media);
      })
    )
  }

  handleFilesUploaded(params: IRequestParamsWithFiles): void {
    const api = this.slideShow ? this.updateAddNewFilesRequest(params) : this.createRequest(params);
    this.subscription.add(
      api.subscribe((res) => {
        this.childComponentRef.isEditing = true;
        this.slideShow = res;
        this.initImages(this.slideShow.media);
      })
    )
  }

  private createRequest(params: IRequestParamsWithFiles): Observable<TAlbumModel> {
    return this.slideShowService.create(params.files);
  }

  private updateAddNewFilesRequest(params: IRequestParamsWithFiles): Observable<TAlbumModel> {
    return this.slideShowService.addNewFiles(params.files);
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
    if(filesWillRemove.length > 0 && galleryItemIndexChanged.length > 0){
      return this.updateRemoveFilesRequest(filesWillRemove).pipe(
        switchMap(() => this.updateItemIndexChangeRequest(galleryItemIndexChanged))
      )
    }else{
      if(filesWillRemove.length > 0){
        return this.updateRemoveFilesRequest(filesWillRemove);
      }
      if(galleryItemIndexChanged.length > 0){
        return this.updateItemIndexChangeRequest(galleryItemIndexChanged);
      }
      return new Observable<TAlbumModel>();
    }
  }

  private updateRemoveFilesRequest(filesWillRemove: Array<string>) {
    return this.slideShowService.removeFiles(filesWillRemove);
  }

  private updateItemIndexChangeRequest(galleryItemIndexChanged: Array<string>) {
    return this.slideShowService.itemIndexChange(galleryItemIndexChanged)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
