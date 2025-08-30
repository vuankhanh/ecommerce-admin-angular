import { Injectable } from '@angular/core';
import { ISuccess } from '../../shared/interface/success.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { TAlbumModel } from '../../shared/interface/album.interface';
import { IFileUpload } from '../../shared/interface/file-upload.interface';
@Injectable({
  providedIn: 'root'
})
export class MediaSlideShowService {
  private readonly url: string = environment.backendApi + '/admin/media/slide-show';

  constructor(
    private httpClient: HttpClient
  ) { }

  get() {
    return this.httpClient.get<IAlbumResponse>(this.url).pipe(
      map(res => res.metaData)
    );
  }

  create(
    fileUploads: IFileUpload[]
  ): Observable<TAlbumModel> {
    if (!fileUploads || !fileUploads.length) {
      throw new Error('Không có file nào được chọn để tải lên');
    }

    const formData = new FormData();

    for (const [index, fileUpload] of fileUploads.entries()) {
      const file = fileUpload.file;
      formData.append('files', file);

      const fileInfo = {
        fileName: file.name,
        description: fileUpload.description,
        alternateName: fileUpload.alternateName
      }
      formData.append('file_' + index, JSON.stringify(fileInfo));
    }

    return this.httpClient.post<IAlbumResponse>(this.url, formData).pipe(
      map(res => res.metaData)
    );
  }

  addNewFiles(fileUploads: IFileUpload[]): Observable<TAlbumModel> {
    if (!fileUploads || !fileUploads.length) {
      throw new Error('Không có file nào được chọn để tải lên');
    }

    const formData = new FormData();

    for (const [index, fileUpload] of fileUploads.entries()) {
      const file = fileUpload.file;
      formData.append('files', file);

      const fileInfo = {
        fileName: file.name,
        description: fileUpload.description,
        alternateName: fileUpload.alternateName
      }
      formData.append('file_' + index, JSON.stringify(fileInfo));
    }

    return this.httpClient.patch<IAlbumResponse>(this.url + '/add-new-files', formData).pipe(
      map(res => res.metaData)
    );
  }

  removeFiles(filesWillRemove: Array<string>): Observable<TAlbumModel> {
    return this.httpClient.patch<IAlbumResponse>(this.url + '/remove-files', { filesWillRemove }).pipe(
      map(res => res.metaData)
    );
  }

  itemIndexChange(newItemIndexChange: Array<string>): Observable<TAlbumModel> {
    return this.httpClient.patch<IAlbumResponse>(this.url + '/item-index-change', { newItemIndexChange }).pipe(
      map(res => res.metaData)
    );
  }

  setHighLightItem(id: string): Observable<TAlbumModel> {
    return this.httpClient.patch<IAlbumResponse>(this.url + '/set-highlight-item', { id }).pipe(
      map(res => res.metaData)
    );
  }

  delete(): Observable<TAlbumModel> {
    return this.httpClient.delete<IAlbumResponse>(this.url).pipe(
      map(res => res.metaData)
    );
  }
}

export interface IAlbumResponse extends ISuccess {
  metaData: TAlbumModel;
}