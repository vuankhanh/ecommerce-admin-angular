import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";

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