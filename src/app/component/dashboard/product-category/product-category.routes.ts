import { Routes } from "@angular/router";
import { ProductCategoryComponent } from "./product-category.component";
import { productCategoryResolver } from "./resolvers/product-category.resolver";

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
        loadComponent: () => import('./product-category-list/product-category-list.component').then(m => m.ProductCategoryListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./product-category-form/product-category-form.component').then(c => c.ProductCategoryFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./product-category-form/product-category-form.component').then(c => c.ProductCategoryFormComponent),
        resolve: { product: productCategoryResolver }
      },
      {
        path: 'detail/:id',
        loadComponent: () => import('./product-category-detail/product-category-detail.component').then(c => c.ProductCategoryDetailComponent),
        resolve: { product: productCategoryResolver }
      }
    ]
  }
];
