
import { BehaviorSubject } from "rxjs";
import { TOrderItem } from "../shared/interface/order-response.interface";

export class OrderItemEntity {

  private rawOrderItems: TOrderItem[];
  orderItems: TOrderItem[];
  totalValue: number = 0;
  totalQuantity: number = 0;

  private readonly bIsChangedItems: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isChangedItems$ = this.bIsChangedItems.asObservable();

  constructor(cartItems: TOrderItem[]) {
    this.rawOrderItems = cartItems;
    this.orderItems = JSON.parse(JSON.stringify(cartItems));
    this.calculateTotalValue();
    this.calculateTotalQuantity();
    const isChangedItem = this.isChangedItem();
    this.bIsChangedItems.next(isChangedItem);
  }

  addItem(orderItem: TOrderItem) {
    this.orderItems.push(orderItem);

    this.calculateTotalValue();
    this.calculateTotalQuantity();
    const isChangedItem = this.isChangedItem();
    this.bIsChangedItems.next(isChangedItem);
  }

  changeQuantity(orderItemId: string, quantity: number) {
    let index = this.orderItems.findIndex((orderItem: TOrderItem) => orderItem._id === orderItemId);
    quantity = quantity || 1; // Default to 1 if quantity is not provided
    if (index !== -1) {
      this.orderItems[index].quantity = quantity;
      this.calculateTotalValue();
      this.calculateTotalQuantity();
      const isChangedItem = this.isChangedItem();
      this.bIsChangedItems.next(isChangedItem);
    } else {
      throw new Error("Không tim thấy sản phẩm trong giỏ hàng");
    }
  }

  removeItem(orderItemId: string) {
    let index = this.orderItems.findIndex((orderItem: TOrderItem) => orderItem._id === orderItemId);
    if (index === -1) {
      throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
    }
    this.orderItems.splice(index, 1);

    this.calculateTotalValue();
    this.calculateTotalQuantity();
    const isChangedItem = this.isChangedItem();
    this.bIsChangedItems.next(isChangedItem);
  }

  resetCart() {
    this.orderItems = [];
    this.totalValue = 0;
    this.totalQuantity = 0;
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
      const existingItem = this.orderItems.some(item => item._id === oldItem._id);
      if (!existingItem) return true;

      //Kiểm tra xem số 2 object có giống nhau không
      // Có thể vị trí sẽ khác nhau
      const newItem = this.orderItems.find(item => item._id === oldItem._id);
      if (!newItem) return true;

      if (oldItem.quantity !== newItem.quantity) return true;
    }

    return false;
  }

  private calculateTotalValue() {
    this.totalValue = this.orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  private calculateTotalQuantity() {
    this.totalQuantity = this.orderItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }
}