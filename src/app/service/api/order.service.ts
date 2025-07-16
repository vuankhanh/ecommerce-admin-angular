import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrderStatus } from '../../shared/constant/order.constant';
import { TOrderDetailModel, TOrderModel } from '../../shared/interface/order-response.interface';
import { IPagination } from '../../shared/interface/pagination.interface';
import { ISuccess } from '../../shared/interface/success.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly url: string = environment.backendApi + '/admin/order';
  constructor(
    private httpClient: HttpClient
  ) { }

  getOrders(orderFilterParams?: IOrderFilterParams, page?: number, size?: number): Observable<TOrder> {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page)
    }
    if (size) {
      params = params.append('size', size)
    }

    const filterParams: IOrderFilterParams = {};

    if (orderFilterParams?.fromDate) filterParams.fromDate = orderFilterParams.fromDate;
    if (orderFilterParams?.toDate) filterParams.toDate = orderFilterParams.toDate;
    if (orderFilterParams?.statuses && orderFilterParams.statuses.length > 0) filterParams.statuses = orderFilterParams.statuses;

    return this.httpClient.post<OrderResponse>(this.url, filterParams, { params }).pipe(
      map(response => response.metaData),
    );
  }

  getDetail(id: string): Observable<TOrderDetailModel> {
    if (!id) {
      throw new Error('Order ID là bắt buộc để lấy chi tiết đơn hàng');
    }

    let params = new HttpParams();
    params = params.append('id', id);

    return this.httpClient.get<OrderDetailResponse>(`${this.url}/detail`, { params }).pipe(
      map(response => response.metaData)
    );
  }
}

export interface IOrderFilterParams {
  fromDate?: Date;
  toDate?: Date;
  statuses?: `${OrderStatus}`[];
}

export type TOrder = {
  data: TOrderModel[];
  paging: IPagination;
}

export interface OrderResponse extends ISuccess {
  metaData: TOrder;
}

export interface OrderDetailResponse extends ISuccess {
  metaData: TOrderDetailModel;
}