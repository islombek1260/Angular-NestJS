import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http'; // Не забудь импорт
import { jwtDecode } from 'jwt-decode';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EditProfileModalComponent } from '../../shared/components/modals/edit-profile-modal/edit-profile-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, EditProfileModalComponent],
templateUrl: './profil.html'
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  private router: Router = inject(Router);

  userInfo: any = null;
  isEditProfileModalOpen = false;
  avatarTimestamp = Date.now();

  ngOnInit() {
    this.loadUserData();
  }

  // Метод для загрузки всех данных пользователя, включая продукты
  loadUserData() {
    const token = this.authService.getToken();
    if (!token) return;

    const decoded: any = jwtDecode(token);
    const userId = decoded?.sub || decoded?.id;

    this.http.get(`http://localhost:3000/users/${userId}`).subscribe({
      next: (data: any) => {
        this.userInfo = data;
        this.authService.updateUser(data); // Обновляем данные в AuthService
        this.cdr.detectChanges(); // Сказать Angular: "Данные изменились, перерисуй!"
      },
      error: (err) => {
        console.error('Ошибка запроса:', err);
      }
    });
  }

  get userAvatar(): string {
    const token = this.authService.getToken();
    if (!token) return 'assets/default-avatar.png';

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded?.sub || decoded?.id;
      return `http://localhost:3000/users/${userId}/avatar?t=${this.avatarTimestamp}`;
    } catch {
      return 'assets/default-avatar.png';
    }
  }

  toggleEditProfileModal() {
    this.isEditProfileModalOpen = true;
  }

  onProfileUpdated() {
    this.avatarTimestamp = Date.now();
    this.isEditProfileModalOpen = false;
    this.loadUserData(); // Обновляем всё, включая возможные изменения в профиле
  }

onLogout() {
  if (confirm('Are you sure you want to logout?')) {
    this.authService.logout();
    
    // Навигация на главную страницу
    this.router.navigate(['/']).then(() => {
      // Опционально: перезагружаем страницу после перехода, 
      // чтобы полностью сбросить состояние приложения
      window.location.reload(); 
    });
  }
}

onDeleteAccount() {
  // 1. Проверяем, есть ли данные пользователя и его ID
  if (!this.userInfo || !this.userInfo.id) {
    alert('User ID not found!');
    return;
  }

  // 2. Двойное подтверждение для безопасности
  const confirmed = confirm('DANGER! This will permanently delete your account and all your products. Continue?');
  
  if (confirmed) {
    // 3. Вызываем метод сервиса
    this.authService.deleteAccount(this.userInfo.id).subscribe({
      next: () => {
        alert('Your account has been successfully deleted.');
        
        // 4. Очищаем сессию (токен, localstorage) через AuthService
        this.authService.logout(); 
        
        // 5. Уходим на главную
        this.router.navigate(['/']).then(() => {
          window.location.reload(); // Сбрасываем состояние приложения
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
}