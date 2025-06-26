import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISuccess } from '../../shared/interface/success.interface';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { TAlbumModel, TMediaModel } from '../../shared/interface/album.interface';

@Injectable({
  providedIn: 'root'
})
export class MediaLogoService {
  private urlMediaLogo: string = environment.backendApi + '/admin/media/logo';
  constructor(
    private httpClient: HttpClient
  ) { }

  get(): Observable<TAlbumModel>{
    return this.httpClient.get<MediaLogoResponse>(this.urlMediaLogo).pipe(
      map(res=>res.metaData)
    );
  }

  getMain(): Observable<TMediaModel> {
    return this.httpClient.get<MediaLogoMainResponse>(this.urlMediaLogo + '/main').pipe(
      map(res=>res.metaData)
    );
  }

  create(
    alternateName: string,
    description: string,
    file: File
  ): Observable<TAlbumModel> {
    const formData = new FormData();

    const fileInfo = {
      fileName: file.name,
      description: description,
      alternateName: alternateName,
    }
    formData.append('file', file);
    formData.append('file_0', JSON.stringify(fileInfo));

    return this.httpClient.post<MediaLogoResponse>(this.urlMediaLogo, formData).pipe(
      map(res=>res.metaData)
    );
  }

  update(
    alternateName: string,
    description: string,
    file: File
  ): Observable<TAlbumModel> {
    const formData = new FormData();

    const fileInfo = {
      fileName: file.name,
      description: description,
      alternateName: alternateName,
    }
    formData.append('file', file);
    formData.append('file_0', JSON.stringify(fileInfo));
    
    return this.httpClient.patch<MediaLogoResponse>(this.urlMediaLogo, formData).pipe(
      map(res=>res.metaData)
    );
  }

  delete(): Observable<TAlbumModel> {
    return this.httpClient.delete<MediaLogoResponse>(this.urlMediaLogo).pipe(
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