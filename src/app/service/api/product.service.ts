import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IProduct, TProductModel } from '../../shared/interface/product.interface';
import { IPagination } from '../../shared/interface/pagination.interface';
import { ISuccess } from '../../shared/interface/success.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly url: string = environment.backendApi + '/product';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getAll(name?: string, page?: number, size?: number): Observable<TProduct>{
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
    return this.httpClient.get<IProductResponse>(this.url).pipe(
      map(response => response.metaData)
    )
  }

  getDetail(id: string): Observable<TProductModel> {
    return this.httpClient.get<IProductDetailResponse>(`${this.url}/${id}`).pipe(
      map(response => response.metaData)
    );
  }

  create(data: IProduct){
    return this.httpClient.post<IProductDetailResponse>(this.url, data).pipe(
      map(res => res.metaData)
    );
  }

  update(id: string, data: Partial<IProduct>){
    return this.httpClient.patch<IProductDetailResponse>(this.url + '/' + id, data).pipe(
      map(res => res.metaData)
    );
  }

  replace(id: string, data: IProduct){
    return this.httpClient.put<IProductDetailResponse>(this.url + '/' + id, data).pipe(
      map(res => res.metaData)
    );
  }

  remove(id: string){
    return this.httpClient.delete<IProductDetailResponse>(this.url + '/' + id).pipe(
      map(res => res.metaData)
    );
  }
}

export type TProduct = {
  data: TProductModel[];
  paging: IPagination;
}

export interface IProductResponse extends ISuccess {
  metaData: TProduct;
}

export interface IProductDetailResponse extends ISuccess {
  metaData: TProductModel;
}