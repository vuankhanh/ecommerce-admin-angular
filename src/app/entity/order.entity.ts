
import { BehaviorSubject } from "rxjs";
import { IOrderItem } from "../shared/interface/order-response.interface";

export class OrderItemEntity {

  private rawOrderItems: IOrderItem[];
  orderItems: IOrderItem[];
  subTotal: number = 0;

  private readonly bIsChangedItems: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isChangedItems$ = this.bIsChangedItems.asObservable();

  constructor(cartItems: IOrderItem[]) {
    this.rawOrderItems = cartItems;
    this.orderItems = JSON.parse(JSON.stringify(cartItems));
    this.calculateSubTotalValue();
    const isChangedItem = this.isChangedItem();
    this.bIsChangedItems.next(isChangedItem);
  }

  addItem(orderItem: IOrderItem) {
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let index = this.orderItems.findIndex((item: IOrderItem) => item.productId === orderItem.productId);
    if (index !== -1) {
      this.orderItems[index].quantity++;
    }else {
      this.orderItems.push(orderItem);
    }


    this.calculateSubTotalValue();
    const isChangedItem = this.isChangedItem();
    this.bIsChangedItems.next(isChangedItem);
  }

  changeQuantity(orderItemProductId: string, quantity: number) {
    let index = this.orderItems.findIndex((orderItem: IOrderItem) => orderItem.productId === orderItemProductId);
    quantity = quantity || 1; // Default to 1 if quantity is not provided
    if (index !== -1) {
      this.orderItems[index].quantity = quantity;
      this.calculateSubTotalValue();
      const isChangedItem = this.isChangedItem();
      this.bIsChangedItems.next(isChangedItem);
    } else {
      throw new Error("Không tim thấy sản phẩm trong giỏ hàng");
    }
  }

  removeItem(orderItemProductId: string) {
    let index = this.orderItems.findIndex((orderItem: IOrderItem) => orderItem.productId === orderItemProductId);
    if (index === -1) {
      throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
    }
    this.orderItems.splice(index, 1);

    this.calculateSubTotalValue();
    const isChangedItem = this.isChangedItem();
    this.bIsChangedItems.next(isChangedItem);
  }

  resetCart() {
    this.orderItems = [];
    this.subTotal = 0;
    const isChangedItem = this.isChangedItem();
    this.bIsChangedItems.next(isChangedItem);
  }

  private isChangedItem() {
    if (this.rawOrderItems.length !== this.orderItems.length) {
      return true;
    }

    for (let i = 0; i < this.rawOrderItems.length; i++) {
      const oldItem = this.rawOrderItems[i];

      //Kiểm tra xem sản phẩm ở items mới có tồn tại ở items cũ không
      const existingItem = this.orderItems.some(item => item.productId === oldItem.productId);
      if (!existingItem) return true;

      //Kiểm tra xem số 2 object có giống nhau không
      // Có thể vị trí sẽ khác nhau
      const newItem = this.orderItems.find(item => item.productId === oldItem.productId);
      if (!newItem) return true;

      if (oldItem.quantity !== newItem.quantity) return true;
    }

    return false;
  }

  private calculateSubTotalValue() {
    this.subTotal = this.orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
}

export class OrderTotalEntity {
  subTotal: number = 0;
  discount: number = 0;
  deliveryFee: number = 0;
  total: number = 0;

  constructor(
    subTotal: number = 0,
    discount: number = 0,
    deliveryFee: number = 0
  ) {
    this.subTotal = subTotal;
    this.discount = discount;
    this.deliveryFee = deliveryFee;
    this.calculateTotal();
  }

  updateSubTotal(subTotal: number) {
    this.subTotal = subTotal;
    this.calculateTotal();
  }

  updateDiscount(discount: number) {
    this.discount = discount;
    this.calculateTotal();
  }

  updateDeliveryFee(deliveryFee: number) {
    this.deliveryFee = deliveryFee;
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.subTotal - this.discount + this.deliveryFee;
  }
}