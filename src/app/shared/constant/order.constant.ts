import { Language } from "./lang.constant";

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export const ORDER_STATUS_LABEL: Record<`${OrderStatus}`, Record<`${Language}`, string>> = {
  PENDING: { vi: 'Chờ xác nhận', en: 'Pending', ja: '保留中' },
  CONFIRMED: { vi: 'Đã xác nhận', en: 'Confirmed', ja: '確認済み' },
  SHIPPING: { vi: 'Đang giao', en: 'Shipping', ja: '配送中' },
  COMPLETED: { vi: 'Hoàn thành', en: 'Completed', ja: '完了' },
  CANCELED: { vi: 'Đã hủy', en: 'Canceled', ja: 'キャンセル' },
};

export function getOrderStatusLabel(status: `${OrderStatus}`, lang: `${Language}`): string {
  return ORDER_STATUS_LABEL[status]?.[lang] || status;
}

export const OrderStatusTransition = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELED],
  [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPING, OrderStatus.CANCELED],
  [OrderStatus.SHIPPING]: [OrderStatus.COMPLETED, OrderStatus.CANCELED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELED]: [],
};

export enum OrderFrom {
  VISITOR = 'VISITOR',
  LOYALTY = 'LOYALTY',
  ADMIN = 'ADMIN',
}

export const ORDER_FROM_LABEL: Record<`${OrderFrom}`, Record<`${Language}`, string>> = {
  VISITOR: { vi: 'Khách vãng lai', en: 'Visitor', ja: '訪問者' },
  LOYALTY: { vi: 'Khách hàng thân thiết', en: 'Loyalty', ja: '常連客' },
  ADMIN: { vi: 'Quản trị viên', en: 'Admin', ja: '管理者' },
}