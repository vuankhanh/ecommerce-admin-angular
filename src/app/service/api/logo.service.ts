import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISuccess } from '../../shared/interface/success.interface';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IImage } from '../../shared/interface/media.interface';
import { IBasicService } from '../../shared/interface/basic_service.interface';

@Injectable({
  providedIn: 'root'
})
export class LogoService implements IBasicService<IImage> {
  private urlLogo: string = environment.backendApi + '/logo';
  constructor(
    private httpClient: HttpClient
  ) { }

  get(): Observable<IImage>{
    return this.httpClient.get<LogoResponse>(this.urlLogo).pipe(
      map(res=>res.metaData)
    );
  }

  create(
    alternateName: string,
    description: string,
    file: Blob
  ): Observable<IImage> {
    const formData = new FormData();
    formData.append('alternateName', alternateName);
    formData.append('description', description);
    formData.append('files', file);

    return this.httpClient.post<LogoResponse>(this.urlLogo, formData).pipe(
      map(res=>res.metaData)
    );
  }

  update(
    alternateName?: string,
    description?: string,
    file?: Blob
  ): Observable<IImage> {
    const formData = new FormData();
    if(alternateName) formData.append('alternateName', alternateName);
    if(description) formData.append('description', description);
    if(file) formData.append('file', file);
    
    return this.httpClient.patch<LogoResponse>(this.urlLogo, formData).pipe(
      map(res=>res.metaData)
    );
  }

  delete(): Observable<IImage> {
    return this.httpClient.delete<LogoResponse>(this.urlLogo).pipe(
      map(res=>res.metaData)
    );
  }
}

export interface LogoResponse extends ISuccess {
  metaData: MetaData
}

type MetaData = IImage & {
  relativePath: string;
}