import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: 'products', // Базовый путь /products
    children: [
      {
        path: '', // Путь для списка продуктов
        loadComponent: () => import('./pages/product-list/').then(m => m.ProductListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      }
    ]
  }
];