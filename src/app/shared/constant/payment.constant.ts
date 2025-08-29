import { Language } from "./lang.constant";

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  PENDING = 'PENDING'
}

export const PAYMENT_METHOD_LABEL: Record<`${PaymentMethod}`, Record<`${Language}`, string>> = {
  CASH: { vi: 'Tiền mặt', en: 'Cash', ja: '現金' },
  TRANSFER: { vi: 'Chuyển khoản', en: 'Transfer', ja: '振込' },
  PENDING: { vi: 'Chưa xác định', en: 'Pending', ja: '保留中' },
}