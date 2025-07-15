import { Routes } from "@angular/router";
import { OrderComponent } from "./order.component";

export const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () => import('./order-list/order-list.component').then(m => m.OrderListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./order-form/order-form.component').then(c => c.OrderFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./order-form/order-form.component').then(c => c.OrderFormComponent)
      },
      {
        path: 'detail/:id',
        loadComponent: () => import('./order-detail/order-detail.component').then(c => c.OrderDetailComponent)
      }
    ]
  }
];