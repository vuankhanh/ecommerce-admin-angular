import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { TAlbumModel } from '../../shared/interface/album.interface';
import { IPagination } from '../../shared/interface/pagination.interface';
import { ISuccess } from '../../shared/interface/success.interface';
import { IFileUpload } from '../../shared/interface/file-upload.interface';

@Injectable({
  providedIn: 'root'
})
export class MediaProductService {
  private readonly url: string = environment.backendApi + '/admin/media/product';
  constructor(
    private httpClient: HttpClient
  ) { }

  getAll(name?: string, page?: number, size?: number): Observable<TAlbumProduct> {
    let params = new HttpParams();
    if (name != undefined) {
      params = params.append('name', name)
    }
    if (page != undefined) {
      params = params.append('page', page)
    }
    if (size != undefined) {
      params = params.append('size', size)
    }
    return this.httpClient.get<AlbumProductResponse>(this.url, { params }).pipe(
      map(response => response.metaData)
    )
  }

  getDetail(id: string): Observable<TAlbumModel> {
    let params = new HttpParams();
    if (id!= undefined) {
      params = params.append('id', id)
    }

    return this.httpClient.get<MediaProductResponse>(`${this.url}/detail`, { params }).pipe(
      map(response => response.metaData)
    );
  }

  create(name: string, fileUploads: IFileUpload[]): Observable<TAlbumModel> {
    if (!fileUploads || !fileUploads.length) {
      throw new Error('Không có file nào được chọn để tải lên');
    }

    let params = new HttpParams();

    if (name != undefined) {
      params = params.append('name', name)
    }

    const formData = new FormData();

    for (let [index, fileUpload] of fileUploads.entries()) {
      const file = fileUpload.file;
      formData.append('files', file);

      const fileInfo = {
        fileName: file.name,
        description: fileUpload.description,
        alternateName: fileUpload.alternateName
      }
      formData.append('file_' + index, JSON.stringify(fileInfo));
    }

    return this.httpClient.post<MediaProductResponse>(this.url, formData, { params }).pipe(
      map(res => res.metaData)
    );
  }

  addNewFiles(id:string, fileUploads: IFileUpload[]): Observable<TAlbumModel> {
    if (!fileUploads || !fileUploads.length) {
      throw new Error('Không có file nào được chọn để tải lên');
    }

    let params = new HttpParams();

    if (id!= undefined) {
      params = params.append('id', id)
    }

    const formData = new FormData();

    for (let [index, fileUpload] of fileUploads.entries()) {
      const file = fileUpload.file;
      formData.append('files', file);

      const fileInfo = {
        fileName: file.name,
        description: fileUpload.description,
        alternateName: fileUpload.alternateName
      }
      formData.append('file_' + index, JSON.stringify(fileInfo));
    }

    return this.httpClient.patch<MediaProductResponse>(this.url + '/add-new-files', formData, { params }).pipe(
      map(res => res.metaData)
    );
  }

  removeFiles(id: string, filesWillRemove: Array<string>): Observable<TAlbumModel> {
    let params = new HttpParams();

    if (id!= undefined) {
      params = params.append('id', id)
    }

    return this.httpClient.patch<MediaProductResponse>(this.url + '/remove-files', { filesWillRemove }, { params }).pipe(
      map(res => res.metaData)
    );
  }

  itemIndexChange(id: string, newItemIndexChange: Array<string>): Observable<TAlbumModel> {
    let params = new HttpParams();

    if (id!= undefined) {
      params = params.append('id', id)
    }
    console.log('newItemIndexChange', newItemIndexChange);
    
    return this.httpClient.patch<MediaProductResponse>(this.url + '/item-index-change', { newItemIndexChange }, { params }).pipe(
      map(res => res.metaData)
    );
  }

  setHighLightItem(id: string, itemId: string): Observable<TAlbumModel> {
    let params = new HttpParams();

    if (id!= undefined) {
      params = params.append('id', id)
    }

    return this.httpClient.patch<MediaProductResponse>(this.url + '/set-highlight-item', { itemId }, { params }).pipe(
      map(res => res.metaData)
    );
  }

  delete(id: string): Observable<TAlbumModel> {
    let params = new HttpParams();

    if (id!= undefined) {
      params = params.append('id', id)
    }

    return this.httpClient.delete<MediaProductResponse>(this.url).pipe(
      map(res => res.metaData)
    );
  }
}


export type TAlbumProduct = {
  data: TAlbumModel[];
  paging: IPagination;
}

export interface AlbumProductResponse extends ISuccess {
  metaData: TAlbumProduct
}

export interface MediaProductResponse extends ISuccess {
  metaData: TAlbumModel
}