import { Injectable } from '@angular/core';
import { Success } from '../../shared/interface/success.interface';
import { HttpClient } from '@angular/common/http';
import { filter, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IImage, IVideo } from '../../shared/interface/media.interface';
import { IBasicService } from '../../shared/interface/basic_service.interface';

@Injectable({
  providedIn: 'root'
})
export class AlbumService implements IBasicService<MediaMetaData> {
  private urlAlbum: string = environment.backendApi + '/album';

  constructor(
    private httpClient: HttpClient
  ) { }

  get(): Observable<MediaMetaData> {
    return this.httpClient.get<AlbumResponse>(this.urlAlbum).pipe(
      filter(res => res.metaData?.mediaItems > 0),
      map(res => res.metaData)
    );
  }

  create(
    alternateName: string,
    description: string,
    files: Array<Blob>
  ): Observable<MediaMetaData> {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('alternateName', alternateName);
    if(files.length){
      for(let file of files){
        formData.append('files', file);
      }
    }
    return this.httpClient.post<AlbumResponse>(this.urlAlbum, formData).pipe(
      map(res => res.metaData)
    );
  }

  update(
    alternateName: string,
    description: string,
    files?: Array<Blob>
  ): Observable<MediaMetaData> {
    const formData = new FormData();
    if(files?.length){
      for(let file of files){
        formData.append('files', file);
      }
    }
    return this.httpClient.patch<AlbumResponse>(this.urlAlbum+'/add-new-files', formData).pipe(
      map(res => res.metaData)
    );
  }

  addNewFiles(files: Array<Blob>): Observable<MediaMetaData> {
    const formData = new FormData();
    for(let file of files){
      formData.append('files', file);
    }
    return this.httpClient.patch<AlbumResponse>(this.urlAlbum+'/add-new-files', formData).pipe(
      map(res => res.metaData)
    );
  }

  removeFiles(filesWillRemove: Array<string>): Observable<MediaMetaData> {
    return this.httpClient.patch<AlbumResponse>(this.urlAlbum+'/remove-files', { filesWillRemove }).pipe(
      map(res => res.metaData)
    );
  }

  itemIndexChange(newItemIndexChange: Array<string>): Observable<MediaMetaData> {
    return this.httpClient.patch<AlbumResponse>(this.urlAlbum+'/item-index-change', { newItemIndexChange }).pipe(
      map(res => res.metaData)
    );
  }

  setHighLightItem(id: string){
    return this.httpClient.patch<AlbumResponse>(this.urlAlbum+'/set-highlight-item', { id }).pipe(
      map(res => res.metaData)
    );
  }
  
  delete(): Observable<MediaMetaData> {
    return this.httpClient.delete<AlbumResponse>(this.urlAlbum).pipe(
      map(res => res.metaData)
    );
  }
}

// mongodb schema
export interface AlbumResponse extends Success {
  metaData: MediaMetaData;
}

export type MediaMetaData = {
  _id: string;
  media: Array<IVideo | IImage>
  mediaItems: number;
  relativePath: string;
  thumbnail: string
  createdAt: Date;
  updatedAt: Date;
}