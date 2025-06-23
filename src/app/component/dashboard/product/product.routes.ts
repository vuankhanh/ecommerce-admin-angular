import { Routes } from "@angular/router";
import { ProductComponent } from "./product.component";
import { productResolver } from "./resolvers/product.resolver";

export const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () => import('./product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./product-form/product-form.component').then(c => c.ProductFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./product-form/product-form.component').then(c => c.ProductFormComponent),
        resolve: { product: productResolver }
      },
      {
        path: 'detail/:id',
        loadComponent: () => import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent),
        resolve: { product: productResolver }
      }
    ]
  }
];
