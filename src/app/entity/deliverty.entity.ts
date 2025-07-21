import { IAddress, IDelivery } from "../shared/interface/address.interface";

export class DeliveryEntity implements IDelivery {
  name: string;
  phoneNumber: string;
  address: IAddress;

  constructor(delivery: IDelivery) {
    this.name = delivery.name;
    this.phoneNumber = delivery.phoneNumber;
    this.address = delivery.address
  }

  toPlainObject(): IDelivery {
    return {
      name: this.name,
      phoneNumber: this.phoneNumber,
      address: this.address
    };
  }
}