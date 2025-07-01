import { Routes } from "@angular/router";
import { productCategoryNameTitleResolver } from "./resolvers/product-category-name-title.resolver";
import { productNameTitleResolver } from "./resolvers/product-name-title.resolver";

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
        title: 'Quảng cáo',
        loadComponent: () => import('./promotion/promotion.component').then(m => m.PromotionComponent)
      },
      {
        path: 'product-category',
        title: 'Danh mục sản phẩm',
        loadComponent: () => import('./product-category/product-category.component').then(m => m.ProductCategoryComponent)
      },
      {
        path: 'product-category/create',
        title: 'Tạo danh mục sản phẩm',
        loadComponent: () => import('./product-category-detail/product-category-detail.component').then(c => c.ProductCategoryDetailComponent),
      },
      {
        path: 'product-category/:id',
        loadComponent: () => import('./product-category-detail/product-category-detail.component').then(c => c.ProductCategoryDetailComponent),
        title: productCategoryNameTitleResolver
      },
      {
        path: 'product',
        title: 'Sản phẩm',
        loadComponent: () => import('./product/product.component').then(m => m.ProductComponent)
      },
      {
        path: 'product/create',
        title: 'Tạo sản phẩm',
        loadComponent: () => import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent),
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent),
        title: productNameTitleResolver
      },
    ]
  }
]