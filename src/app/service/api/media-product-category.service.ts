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
export class MediaProductCategoryService {
  private readonly url: string = environment.backendApi + '/admin/media/product-category';
  constructor(
    private httpClient: HttpClient
  ) { }

  getAll(name?: string, page?: number, size?: number): Observable<TAlbumProductCategory> {
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
    return this.httpClient.get<AlbumProductCategoryResponse>(this.url).pipe(
      map(response => response.metaData)
    )
  }

  getDetail(id: string): Observable<TAlbumModel> {
    return this.httpClient.get<MediaProductCategoryResponse>(`${this.url}/detail/${id}`).pipe(
      map(response => response.metaData)
    );
  }

  create(fileUpload: IFileUpload): Observable<TAlbumModel> {
    const formData = new FormData();

    const file = fileUpload.file;
    formData.append('file', fileUpload.file);
    const fileInfo = {
      fileName: file.name,
      description: fileUpload.description,
      alternateName: fileUpload.alternateName,
    }
    formData.append('file_0', JSON.stringify(fileInfo));

    return this.httpClient.post<MediaProductCategoryResponse>(this.url, formData).pipe(
      map(res => res.metaData)
    );
  }

  addNewFiles(fileUpload: IFileUpload): Observable<TAlbumModel> {
    const formData = new FormData();

    const file = fileUpload.file;
    formData.append('file', fileUpload.file);
    const fileInfo = {
      fileName: file.name,
      description: fileUpload.description,
      alternateName: fileUpload.alternateName,
    }
    formData.append('file_0', JSON.stringify(fileInfo));

    return this.httpClient.patch<MediaProductCategoryResponse>(this.url + '/add-new-files', formData).pipe(
      map(res => res.metaData)
    );
  }

  removeFiles(filesWillRemove: Array<string>): Observable<TAlbumModel> {
    return this.httpClient.patch<MediaProductCategoryResponse>(this.url + '/remove-files', { filesWillRemove }).pipe(
      map(res => res.metaData)
    );
  }

  itemIndexChange(newItemIndexChange: Array<string>): Observable<TAlbumModel> {
    return this.httpClient.patch<MediaProductCategoryResponse>(this.url + '/item-index-change', { newItemIndexChange }).pipe(
      map(res => res.metaData)
    );
  }

  setHighLightItem(id: string): Observable<TAlbumModel> {
    return this.httpClient.patch<MediaProductCategoryResponse>(this.url + '/set-highlight-item', { id }).pipe(
      map(res => res.metaData)
    );
  }

  delete(): Observable<TAlbumModel> {
    return this.httpClient.delete<MediaProductCategoryResponse>(this.url).pipe(
      map(res => res.metaData)
    );
  }
}


export type TAlbumProductCategory = {
  data: TAlbumModel[];
  paging: IPagination;
}

export interface AlbumProductCategoryResponse extends ISuccess {
  metaData: TAlbumProductCategory
}

export interface MediaProductCategoryResponse extends ISuccess {
  metaData: TAlbumModel
}