import { OrderStatus } from "../constant/order.constant";
import { TDeliveryModel } from "./address.interface";
import { IMongodbDocument } from "./mongo.interface";
import { TPaymentMethod } from "./payment.interface";

export type TOrderStatus = `${OrderStatus}`;

export interface IOrderResponse {
  orderItems: IOrderItem[];
  status: TOrderStatus;
  paymentMethod: TPaymentMethod;
  subTotal: number;
  total: number;
  discount: number;
  deliveryFee: number;
}
export interface IOrderDetailResponse {
  customerId: string;
  orderCode: string;
  orderItems: IOrderItem[];
  status: TOrderStatus;
  paymentMethod: TPaymentMethod;
  subTotal: number;
  total: number;
  discount: number;
  deliveryFee: number;
  delivery: TDeliveryModel;
  note: string;
}

export interface IOrderItem {
  productThumbnail: string;
  productCode: string;
  productName: string;
  quantity: number;
  price: number;
}

export type TOrderModel = IOrderResponse & IMongodbDocument;
export type TOrderDetailModel = IOrderDetailResponse & IMongodbDocument