import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        loadComponent: () => 
          import('./pages/login/login').then(m => m.Login),
        title: 'Вход в систему'
      },
      {
        path: 'register',
        loadComponent: () => 
          import('./pages/register/register').then(m => m.Register),
        title: 'Регистрация'
      },
      {
        path: 'forgot-password',
        loadComponent: () => 
          import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword),
        title: 'Восстановление пароля'
      }
    ]
  }
];