import { TMenu } from "../interface/menu.interface";

export const Menu: TMenu[] = [
  {
    name: 'Trang chủ',
    icon: {
      fontSet: 'fa-solid',
      fontIcon: 'fa-house'
    },
    route: '/dashboard/home'
  },
  {
    name: 'Đơn hàng',
    icon: {
      fontSet: 'fa-solid',
      fontIcon: 'fa-cart-shopping'
    },
    children: [
      {
        name: 'Danh sách đơn hàng',
        route: '/dashboard/order/list'
      },
      {
        name: 'Chi tiết đơn hàng',
        route: '/dashboard/order/detail'
      }
    ]
  },
  {
    name: 'Sản phẩm',
    icon: {
      fontSet: 'fa-brands',
      fontIcon: 'fa-product-hunt'
    },
    children: [
      {
        name: 'Sản phẩm',
        route: '/dashboard/product'
      },
      {
        name: 'Danh mục sản phẩm',
        route: '/dashboard/product-category'
      }
    ]
  },
  {
    name: 'Media',
    icon: {
      fontSet: 'fa-solid',
      fontIcon: 'fa-images'
    },
    children: [
      {
        name: 'Sản phẩm',
        route: '/dashboard/media/product'
      },
      {
        name: 'Danh mục sản phẩm',
        route: '/dashboard/media/product-category'
      },
      {
        name: 'Slide show',
        route: '/dashboard/media/slide-show'
      },
      {
        name: 'Promotion',
        route: '/dashboard/media/promotion'
      },
      {
        name: 'Logo',
        route: '/dashboard/media/logo'
      },
    ]
  }
]