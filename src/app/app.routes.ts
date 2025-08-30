import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { permissionGuard } from './shared/core/guard/permission.guard';
import { jwtPayloadResolver } from './shared/core/resolver/jwt-payload.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./component/dashboard/dashboard.routes').then(m => m.routes),
    canActivate: [permissionGuard],
    resolve: { user: jwtPayloadResolver }
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];