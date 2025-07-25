export interface IInputFeeDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  fee?: number; // Optional initial delivery fee
}