import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', // Главная страница при входе на сайт
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    title: 'Главная панель'
  },  
  {
    path: 'auth', // Раздел авторизации (по желанию)
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
    {
    path: 'profil', // Раздел профиля (по желанию)
    loadComponent: () => import('./features/profil/profil').then(m => m.ProfileComponent)
  },
  {
    path: '**', // Если ввели несуществующий адрес
    redirectTo: '' 
  }
];