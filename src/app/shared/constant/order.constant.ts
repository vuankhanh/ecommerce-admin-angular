export enum OrderStatus {
  PENDING = 'Chờ xác nhận',
  CONFIRMED = 'Đã xác nhận',
  SHIPPING = 'Đang giao',
  COMPLETED = 'Hoàn thành',
  CANCELED = 'Đã hủy',
}

export enum OrderFrom {
  VISITOR = 'Khách vãng lai',
  LOYALTY = 'Khách hàng thân thiết',
  ADMIN = 'Quản trị viên',
}