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
        loadComponent: () => import('./slide-show/slide-show.component').then(m => m.SlideShowComponent)
      },
      {
        path: 'logo',
        loadComponent: () => import('./logo/logo.component').then(m => m.LogoComponent)
      },
      {
        path: 'hightlight-marketing',
        loadComponent: () => import('./hightlight-marketing/hightlight-marketing.component').then(m => m.HightlightMarketingComponent)
      }
    ]
  }
]