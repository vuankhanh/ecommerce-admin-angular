import { IMenu } from "../interface/menu.interface";

export const Menu: IMenu[] = [
  {
    name: 'Trang chủ',
    icon: 'home',
    route: ''
  },
  {
    name: 'Sản phẩm',
    icon: 'category',
    route: '/dashboard/product',
    children: [
      {
        name: 'Sản phẩm',
        route: ''
      },
      {
        name: 'Danh mục sản phẩm',
        route: 'product-category'
      }
    ]
  },
  {
    name: 'Khách hàng',
    icon: 'assets/images/customer.png',
    route: 'customer'
  },
  {
    name: 'Đơn hàng',
    icon: 'assets/images/order.png',
    route: 'order'
  },
  {
    name: 'Sản phẩm',
    icon: 'assets/images/product.png',
    route: 'product'
  },
  {
    name: 'Nhân viên',
    icon: 'assets/images/employee.png',
    route: 'employee'
  },
  {
    name: 'Cài đặt hệ thống',
    icon: 'assets/images/system-setting.png',
    route: 'system-setting'
  },
  {
    name: 'icon',
    icon: 'assets/images/icon.png',
    route: 'icon'
  },
  {
    name: 'Trình chiếu ảnh',
    icon: 'assets/images/slide-show.png',
    route: 'slide-show'
  },
  {
    name: 'Ảnh Marketing',
    icon: 'assets/images/hightlight-marketing.png',
    route: 'hightlight-marketing'
  },
  {
    name: 'Thông báo',
    icon: 'assets/images/notification.png',
    route: 'notification'
  }
]