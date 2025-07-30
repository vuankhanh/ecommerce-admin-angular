import { OrderFrom, OrderStatus } from "../constant/order.constant";
import { TDeliveryModel } from "./address.interface";
import { IMongodbDocument } from "./mongo.interface";
import { TPaymentMethod } from "./payment.interface";
import { IUserInformation } from "./user_information.interface";

export type TOrderStatus = `${OrderStatus}`;

export interface IOrderResponse {
  orderFrom: `${OrderFrom}`;
  orderItems: TOrderItem[];
  status: TOrderStatus;
  paymentMethod: TPaymentMethod;
  subTotal: number;
  total: number;
  discount: number;
  deliveryFee: number;
}
export interface IOrderDetailResponse {
  customerId?: string;
  customer?: IUserInformation;
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
  productId: string;
  productThumbnail: string;
  productCode: string;
  productName: string;
  productCategorySlug: string;
  productSlug: string;
  quantity: number;
  price: number;
}

export type TOrderItem = IOrderItem & IMongodbDocument;

export type TOrderModel = IOrderResponse & IMongodbDocument;
export type TOrderDetailModel = IOrderDetailResponse & IMongodbDocument