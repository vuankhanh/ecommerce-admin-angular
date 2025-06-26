import { Route, Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'slide-show',
        pathMatch: 'full'
      },
      {
        path: 'slide-show',
        title: 'Slide Show',
        loadComponent: () => import('./slide-show/slide-show.component').then(m => m.SlideShowComponent)
      },
      {
        path: 'logo',
        title: 'Logo',
        loadComponent: () => import('./logo/logo.component').then(m => m.LogoComponent)
      },
      {
        path: 'promotion',
        title: 'Promotion',
        loadComponent: () => import('./promotion/promotion.component').then(m => m.PromotionComponent)
      }
    ]
  }
]