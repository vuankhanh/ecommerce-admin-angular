import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { HomeComponent } from "./home/home.component";

export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'product',
        pathMatch: 'full'
      },
      {
        path: 'home',
        title: 'Trang chủ',
        component: HomeComponent
      },
      {
        path: 'order',
        title: 'Đơn hàng',
        loadChildren: () => import('./order/order.routes').then(m => m.routes)
      },
      {
        path: 'product',
        title: 'Sản phẩm',
        loadChildren: () => import('./product/product.routes').then(m => m.routes)
      },
      {
        path: 'product-category',
        title: 'Danh mục sản phẩm',
        loadChildren: () => import('./product-category/product-category.routes').then(m => m.routes)
      },
      {
        path: 'media',
        title: 'Media',
        loadChildren: () => import('./media/media.routes').then(m => m.routes)
      }
    ]
  }
];