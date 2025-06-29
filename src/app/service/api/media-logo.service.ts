import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISuccess } from '../../shared/interface/success.interface';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { TAlbumModel, TMediaModel } from '../../shared/interface/album.interface';
import { IFileUpload } from '../../shared/interface/file-upload.interface';

@Injectable({
  providedIn: 'root'
})
export class MediaLogoService {
  private url: string = environment.backendApi + '/admin/media/logo';
  constructor(
    private httpClient: HttpClient
  ) { }

  get(): Observable<TAlbumModel>{
    return this.httpClient.get<MediaLogoResponse>(this.url).pipe(
      map(res=>res.metaData)
    );
  }

  getMain(): Observable<TMediaModel> {
    return this.httpClient.get<MediaLogoMainResponse>(this.url + '/main').pipe(
      map(res=>res.metaData)
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

    return this.httpClient.post<MediaLogoResponse>(this.url, formData).pipe(
      map(res=>res.metaData)
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
    
    return this.httpClient.patch<MediaLogoResponse>(this.url, formData).pipe(
      map(res=>res.metaData)
    );
  }

  delete(): Observable<TAlbumModel> {
    return this.httpClient.delete<MediaLogoResponse>(this.url).pipe(
      map(res=>res.metaData)
    );
  }
}

export interface MediaLogoResponse extends ISuccess {
  metaData: TAlbumModel
}

export interface MediaLogoMainResponse extends ISuccess {
  metaData: TMediaModel
}