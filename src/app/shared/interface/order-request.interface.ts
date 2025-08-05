
import { IDelivery } from "./address.interface";
import { TOrderStatus } from "./order-response.interface";
import { TPaymentMethod } from "./payment.interface";

export interface IOrderCreateRequest {
  orderItems: IOrderItemsRequest[];
  paymentMethod: `${TPaymentMethod}`;
  deliveryFee: number;
  discount: number;
  note?: string;
  delivery: IDelivery;
}

export interface IOrderUpdateRequest extends Partial<IOrderCreateRequest> {
  orderItems?: IOrderItemsRequest[];
  paymentMethod?: `${TPaymentMethod}`;
  deliveryFee?: number;
  discount?: number;
  delivery?: IDelivery;
}

export interface IOrderItemsRequest {
  productId: string;
  quantity: number;
}