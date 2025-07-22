
import { TOrderItem } from "../shared/interface/order-response.interface";

export class OrderItemEntity {
  orderItems: TOrderItem[];
  totalValue: number = 0;
  totalQuantity: number = 0;

  constructor(cartItems: TOrderItem[]) {
    this.orderItems = [...cartItems];
    this.calculateTotalValue();
    this.calculateTotalQuantity();
  }

  addItem(orderItem: TOrderItem) {
    this.orderItems.push(orderItem);

    this.calculateTotalValue();
    this.calculateTotalQuantity();
  }

  changeQuantity(orderItemId: string, quantity: number) {
    let index = this.orderItems.findIndex((orderItem: TOrderItem) => orderItem._id === orderItemId);
    quantity = quantity || 1; // Default to 1 if quantity is not provided
    if (index !== -1) {
      this.orderItems[index].quantity = quantity;
      this.calculateTotalValue();
      this.calculateTotalQuantity();
    }else {
      throw new Error("Không tim thấy sản phẩm trong giỏ hàng");
    }
  }

  removeItem(orderItemId: string) {
    let index = this.orderItems.findIndex((orderItem: TOrderItem) => orderItem._id === orderItemId);
    if (index === -1) {
      throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
    }
    this.orderItems.splice(index, 1);
    console.log(this.orderItems);
    
    this.calculateTotalValue();
    this.calculateTotalQuantity();
  }

  resetCart() {
    this.orderItems = [];
    this.totalValue = 0;
    this.totalQuantity = 0;
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