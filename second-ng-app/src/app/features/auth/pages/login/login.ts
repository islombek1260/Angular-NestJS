import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Создаем группу полей с валидацией
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

onSubmit() {
  if (this.loginForm.valid) {
    // 1. Извлекаем данные из формы
    const payload = this.loginForm.value;


    this.authService.login(payload).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Статус:', err.status);
        console.error('Ответ:', err.error);
      }
    });
  } else {
    console.warn('⚠️ Форма невалидна, отправка отменена');
  }
}
}