import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ISuccess } from '../../shared/interface/success.interface';
import { IImage } from '../../shared/interface/media.interface';
import { environment } from '../../../environments/environment.development';
import { IBasicService } from '../../shared/interface/basic_service.interface';

@Injectable({
  providedIn: 'root'
})
export class HightlightMarketingService implements IBasicService<IImage> {
  private urlHightlightMarketing: string = environment.backendApi + '/hightlight-marketing';

  constructor(
    private httpClient: HttpClient
  ) { }

  get(): Observable<IImage>{
    return this.httpClient.get<HightlightMarketingResponse>(this.urlHightlightMarketing).pipe(
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
    formData.append('file', file);

    return this.httpClient.post<HightlightMarketingResponse>(this.urlHightlightMarketing, formData).pipe(
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
    
    return this.httpClient.patch<HightlightMarketingResponse>(this.urlHightlightMarketing, formData).pipe(
      map(res=>res.metaData)
    );
  }

  delete(): Observable<IImage> {
    return this.httpClient.delete<HightlightMarketingResponse>(this.urlHightlightMarketing).pipe(
      map(res=>res.metaData)
    );
  }
}

export interface HightlightMarketingResponse extends ISuccess {
  metaData: MetaData
}

type MetaData = IImage & {
  relativePath: string;
}