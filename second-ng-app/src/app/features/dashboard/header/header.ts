import { Component, ElementRef, HostListener, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html'
})
export class HeaderComponent implements OnInit {
  // Инъекции зависимостей
  public authService = inject(AuthService);
  public themeService = inject(ThemeService);
  private cd = inject(ChangeDetectorRef);
  private eRef = inject(ElementRef);

  // Оставляем ОДНУ переменную для имени
  userNameDisplay: string = 'Гость';
  // Переменная для аватара, чтобы избежать ошибки ExpressionChangedAfterItHasBeenCheckedError
  avatarUrl: string = 'assets/default-avatar.png';

  isMobileMenuOpen = false;
  isProfileMenuOpen = false;
userAvatar: any;

  ngOnInit() {
    // 1. Загружаем данные из токена сразу при инициализации
    this.refreshHeaderData();

    // 2. Подписываемся на "живой" поток данных из AuthService
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          // Если пришли данные из бэкенда, приоритет им
          if (user.userName) {
            this.userNameDisplay = user.userName;
          }
          // Обновляем ссылку на аватар
          this.refreshHeaderData();

          // Принудительно уведомляем Angular об изменениях
          this.cd.detectChanges();
        }
      },
      error: (err) => console.error('Ошибка в подписке Header:', err)
    });
  }

  /**
   * Метод для обновления имени и аватара на основе токена или текущего состояния
   */
  private refreshHeaderData() {
    const token = this.authService.getToken();
    if (!token) {
      this.userNameDisplay = 'Гость';
      this.avatarUrl = 'assets/default-avatar.png';
      return;
    }

    try {
      const decoded: any = jwtDecode(token);

      // Обновляем имя (если оно еще не установлено из потока)
      if (this.userNameDisplay === 'Гость' || this.userNameDisplay === 'User') {
        this.userNameDisplay = decoded.userName || decoded.email || 'User';
      }

      // Обновляем URL аватара с меткой времени, чтобы сбросить кэш браузера
      const userId = decoded?.sub || decoded?.id;
      if (userId) {
        this.avatarUrl = `http://localhost:3000/users/${userId}/avatar?t=${Date.now()}`;
      }
    } catch (e) {
      console.error('Ошибка декодирования токена:', e);
      this.userNameDisplay = 'User';
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onLogout() {
    this.isProfileMenuOpen = false;
    this.authService.logout();
    // Вместо полной перезагрузки страницы лучше использовать роутер, 
    // но если логика требует reload, оставляем:
    window.location.reload();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen = false;
    }
  }
}