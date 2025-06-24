import { Injectable } from '@angular/core';
import { ISuccess } from '../../shared/interface/success.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { TAlbumModel } from '../../shared/interface/album.interface';
import { IPagination } from '../../shared/interface/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private readonly url: string = environment.backendApi + '/album';

  constructor(
    private httpClient: HttpClient
  ) { }

  get(): Observable<TAlbum> {
    return this.httpClient.get<IAlbumResponse>(this.url).pipe(
      map(res => res.metaData)
    );
  }

  getDetail(detailParams: DetailParams) {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(detailParams)) {
      params = params.append(k, v)
    }
    return this.httpClient.get<IAlbumDetailResponse>(this.url + '/detail', { params }).pipe(
      map(res => res.metaData)
    );
  }

  create(
    alternateName: string,
    description: string,
    files: Array<Blob>
  ): Observable<TAlbumModel> {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('alternateName', alternateName);
    if(files.length){
      for(let file of files){
        formData.append('files', file);
      }
    }
    return this.httpClient.post<IAlbumDetailResponse>(this.url, formData).pipe(
      map(res => res.metaData)
    );
  }

  update(
    alternateName: string,
    description: string,
    files?: Array<Blob>
  ): Observable<TAlbumModel> {
    const formData = new FormData();
    if(files?.length){
      for(let file of files){
        formData.append('files', file);
      }
    }
    return this.httpClient.patch<IAlbumDetailResponse>(this.url+'/add-new-files', formData).pipe(
      map(res => res.metaData)
    );
  }

  addNewFiles(files: Array<Blob>): Observable<TAlbumModel> {
    const formData = new FormData();
    for(let file of files){
      formData.append('files', file);
    }
    return this.httpClient.patch<IAlbumDetailResponse>(this.url+'/add-new-files', formData).pipe(
      map(res => res.metaData)
    );
  }

  removeFiles(filesWillRemove: Array<string>): Observable<TAlbumModel> {
    return this.httpClient.patch<IAlbumDetailResponse>(this.url+'/remove-files', { filesWillRemove }).pipe(
      map(res => res.metaData)
    );
  }

  itemIndexChange(newItemIndexChange: Array<string>): Observable<TAlbumModel> {
    return this.httpClient.patch<IAlbumDetailResponse>(this.url+'/item-index-change', { newItemIndexChange }).pipe(
      map(res => res.metaData)
    );
  }

  setHighLightItem(id: string): Observable<TAlbumModel>{
    return this.httpClient.patch<IAlbumDetailResponse>(this.url+'/set-highlight-item', { id }).pipe(
      map(res => res.metaData)
    );
  }
  
  delete(): Observable<TAlbumModel> {
    return this.httpClient.delete<IAlbumDetailResponse>(this.url).pipe(
      map(res => res.metaData)
    );
  }
}

export interface DetailParams {
  id?: string,
  route?: string
}

export type TAlbum = {
  data: TAlbumModel[];
  paging: IPagination;
}

export interface IAlbumResponse extends ISuccess {
  metaData: TAlbum;
}

export interface IAlbumDetailResponse extends ISuccess {
  metaData: TAlbumModel
}