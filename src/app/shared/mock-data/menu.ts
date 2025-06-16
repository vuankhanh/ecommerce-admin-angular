export const CustomerMenu: Array<Menu> = [
  {
    icon: 'personal',
    title: 'Thông tin cá nhân',
    route: 'personal'
  }, {
    icon: 'shopping_cart',
    title: 'Lịch sử mua hàng',
    route: 'order-history'
  }, {
    icon: 'place',
    title: 'Sổ địa chỉ',
    route: 'address-book'
  },
]

export interface Menu {
  icon?: string;
  svgIcon?: string,
  title: string,
  route: string
}