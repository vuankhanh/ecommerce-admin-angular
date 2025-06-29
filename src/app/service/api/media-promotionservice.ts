import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ISuccess } from '../../shared/interface/success.interface';
import { environment } from '../../../environments/environment.development';
import { TAlbumModel, TMediaModel } from '../../shared/interface/album.interface';
import { IFileUpload } from '../../shared/interface/file-upload.interface';

@Injectable({
  providedIn: 'root'
})
export class MediaPromotionService {
  private url: string = environment.backendApi + '/admin/media/promotion';

  constructor(
    private httpClient: HttpClient
  ) { }

  get(): Observable<TAlbumModel> {
    return this.httpClient.get<MediaPromotionResponse>(this.url).pipe(
      map(res => res.metaData)
    );
  }

  getMain(): Observable<TMediaModel> {
    return this.httpClient.get<MediaPromotionMainResponse>(this.url + '/main').pipe(
      map(res => res.metaData)
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

    return this.httpClient.post<MediaPromotionResponse>(this.url, formData).pipe(
      map(res => res.metaData)
    );
  }

  update(fileUpload: IFileUpload): Observable<TAlbumModel> {
    const formData = new FormData();

    const file = fileUpload.file;
    formData.append('file', fileUpload.file);
    const fileInfo = {
      fileName: file.name,
      description: fileUpload.description,
      alternateName: fileUpload.alternateName,
    }
    formData.append('file_0', JSON.stringify(fileInfo));

    return this.httpClient.patch<MediaPromotionResponse>(this.url, formData).pipe(
      map(res => res.metaData)
    );
  }

  delete(): Observable<TAlbumModel> {
    return this.httpClient.delete<MediaPromotionResponse>(this.url).pipe(
      map(res => res.metaData)
    );
  }
}

export interface MediaPromotionResponse extends ISuccess {
  metaData: TAlbumModel
}

export interface MediaPromotionMainResponse extends ISuccess {
  metaData: TMediaModel
}