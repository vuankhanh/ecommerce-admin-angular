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
    name: 'Media',
    icon: 'image',
    route: '/dashboard/media',
    children: [
      {
        name: 'Slide show',
        route: 'slide-show'
      },
      {
        name: 'Logo',
        route: 'logo'
      },
      {
        name: 'Hightlight marketing',
        route: 'hightlight-marketing'
      }
    ]
  }
]