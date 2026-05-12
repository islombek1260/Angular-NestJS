// core/services/theme.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Используем Angular Signals для реактивности
  isDarkMode = signal<boolean>(localStorage.getItem('theme') === 'dark');

  constructor() {
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode.update(mode => !mode);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}