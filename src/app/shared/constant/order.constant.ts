export enum OrderStatus {
  PENDING = 'Chờ xác nhận',
  CONFIRMED = 'Đã xác nhận',
  SHIPPING = 'Đang giao',
  COMPLETED = 'Hoàn thành',
  CANCELED = 'Đã hủy',
}

export const OrderStatusTransition = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELED],
  [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPING, OrderStatus.CANCELED],
  [OrderStatus.SHIPPING]: [OrderStatus.COMPLETED, OrderStatus.CANCELED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELED]: [],
};

export enum OrderFrom {
  VISITOR = 'Khách vãng lai',
  LOYALTY = 'Khách hàng thân thiết',
  ADMIN = 'Quản trị viên',
}