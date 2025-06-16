import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { LogoComponent } from "./logo/logo.component";
import { HightlightMarketingComponent } from "./hightlight-marketing/hightlight-marketing.component";
import { SlideShowComponent } from "./slide-show/slide-show.component";
import { NotificationComponent } from "./notification/notification.component";

export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'logo',
        pathMatch: 'full'
      },
      {
        path: 'logo',
        title: 'Logo',
        component: LogoComponent
      },
      {
        path: 'slide-show',
        title: 'Trình chiếu ảnh',
        component: SlideShowComponent
      },
      {
        path: 'hightlight-marketing',
        title: 'Ảnh marketing',
        component: HightlightMarketingComponent
      },
      {
        path: 'notification',
        title: 'Thông báo',
        component: NotificationComponent
      }
    ]
  }
];