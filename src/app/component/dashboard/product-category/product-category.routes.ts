import { Routes } from "@angular/router";
import { ProductCategoryComponent } from "./product-category.component";

export const routes: Routes = [
  {
    path: '',
    component: ProductCategoryComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        title: 'Danh sách danh mục sản phẩm',
        loadComponent: () => import('./product-category-list/product-category-list.component').then(m => m.ProductCategoryListComponent)
      },
      {
        path: 'create',
        title: 'Tạo mới danh mục sản phẩm',
        loadComponent: () => import('./product-category-form/product-category-form.component').then(c => c.ProductCategoryFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./product-category-form/product-category-form.component').then(c => c.ProductCategoryFormComponent),
      },
      {
        path: 'detail/:id',
        loadComponent: () => import('./product-category-detail/product-category-detail.component').then(c => c.ProductCategoryDetailComponent),
      }
    ]
  }
];
