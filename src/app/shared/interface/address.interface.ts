import { IMongodbDocument } from "./mongo.interface";
import { IDistrict, IProvince, IWard } from "./vn-public-apis.interface";

export interface IAddress {
  province: IProvince; // Province object
  district: IDistrict; // District object
  ward: IWard; // Ward object
  street: string; // Street name or address
}

export interface IDelivery {
  name: string,
  phoneNumber: string,
  address: IAddress
}

export interface IDeliveryResponse extends IDelivery {
  addressDetail: string,
  isDefault: boolean
}

export type TDeliveryModel = IDeliveryResponse & IMongodbDocument;