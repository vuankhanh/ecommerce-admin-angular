import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { LogoComponent } from "./media/logo/logo.component";
import { HightlightMarketingComponent } from "./media/hightlight-marketing/hightlight-marketing.component";
import { SlideShowComponent } from "./media/slide-show/slide-show.component";
import { NotificationComponent } from "./notification/notification.component";

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
        path: 'media',
        title: 'Media',
        loadChildren: () => import('./media/media.routes').then(m => m.routes)
      }
    ]
  }
];