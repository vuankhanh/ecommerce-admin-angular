import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileDragAndDropComponent } from '../../../shared/component/file-drag-and-drop/file-drag-and-drop.component';
import { forkJoin, Observable, Subscription, switchMap } from 'rxjs';
import { AlbumService, MediaMetaData } from '../../../service/api/album.service';
import { CommonModule } from '@angular/common';
import { PrefixBackendStaticPipe } from '../../../shared/pipe/prefix-backend.pipe';
import { IRequestParamsWithFiles } from '../../../shared/interface/request.interface';
import { IImage, IVideo } from '../../../shared/interface/media.interface';
import { GalleryComponent } from '@daelmaak/ngx-gallery';
import { GalleryCustomThumbsComponent } from '../../../shared/component/gallery-custom-thumbs/gallery-custom-thumbs.component';
import { GalleryItemTemporarilyDeletedComponent } from '../../../shared/component/gallery-item-temporarily-deleted/gallery-item-temporarily-deleted.component';
import { IGalleryItem } from '../../../shared/interface/gallery.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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

  mediaMetaData?: MediaMetaData;
  galleryItems: IGalleryItem[] = [];
  galleryItemTemporarilyDeleted: IGalleryItem[] = [];
  galleryItemIndexChanged: Array<string> = [];

  imageMIMETypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/webm'];

  subscription: Subscription = new Subscription();
  constructor(
    private albumService: AlbumService,
    private prefixBackendStaticPipe: PrefixBackendStaticPipe,
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.albumService.get().subscribe((mediaMetaData) => {
        this.mediaMetaData = mediaMetaData;
        this.initImages(mediaMetaData.media);
      })
    )
  }

  handleFilesUploaded(params: IRequestParamsWithFiles): void {
    const api = this.mediaMetaData ? this.updateAddNewFilesRequest(params) : this.createRequest(params);
    this.subscription.add(
      api.subscribe((mediaMetaData) => {
        this.childComponentRef.isEditing = true;
        this.mediaMetaData = mediaMetaData;
        this.initImages(mediaMetaData.media);
      })
    )
  }

  private createRequest(params: IRequestParamsWithFiles): Observable<MediaMetaData> {
    return this.albumService.create(params.alternateName, params.description, params.files);
  }

  private updateAddNewFilesRequest(params: IRequestParamsWithFiles): Observable<MediaMetaData> {
    return this.albumService.addNewFiles(params.files);
  }

  private initImages(medias: Array<IImage | IVideo>): Array<IGalleryItem> {
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
        isHighlight: !!media.isHighlight ? true : false,
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

  handleItemSetHighLight(id: string): void {
    this.subscription.add(
      this.albumService.setHighLightItem(id).subscribe((mediaMetaData) => {
        this.mediaMetaData = mediaMetaData;
        this.galleryItems = this.initImages(mediaMetaData.media);
      })
    )
  }

  onGalleryItemRestore(item: IGalleryItem): void {
    this.galleryItems = [...this.galleryItems, item];
  }

  update() {
    const filesWillRemove = this.galleryItemTemporarilyDeleted.map(item => item._id);
    const galleryItemIndexChanged = this.galleryItemIndexChanged;
    
    this.updateRequest(filesWillRemove, galleryItemIndexChanged).subscribe((mediaMetaData) => {
      this.mediaMetaData = mediaMetaData;
      this.galleryItemTemporarilyDeleted = [];
      this.galleryItemIndexChanged = [];
    });
  }

  private updateRequest(filesWillRemove: Array<string>, galleryItemIndexChanged: Array<string>): Observable<MediaMetaData> {
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
      return new Observable<MediaMetaData>();
    }
  }

  private updateRemoveFilesRequest(filesWillRemove: Array<string>): Observable<MediaMetaData> {
    return this.albumService.removeFiles(filesWillRemove);
  }

  private updateItemIndexChangeRequest(galleryItemIndexChanged: Array<string>): Observable<MediaMetaData> {
    return this.albumService.itemIndexChange(galleryItemIndexChanged)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
