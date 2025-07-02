import { Routes } from "@angular/router";
import { ProductComponent } from "./product.component";

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
        loadComponent: () => import('./product-form/product-form.component').then(c => c.ProductFormComponent)
      },
      {
        path: 'detail/:id',
        loadComponent: () => import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent)
      }
    ]
  }
];
