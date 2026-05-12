import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // Добавил Router
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Импорт клиента

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html'
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string = ''; // Для вывода ошибок от сервера

  constructor(
    private fb: FormBuilder,
    private http: HttpClient, // Инжектируем клиент
    private router: Router     // Инжектируем роутер для редиректа
  ) {
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value 
      ? { mismatch: true } 
      : null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.errorMessage = '';
      
      // ВАЖНО: Преобразуем данные формы под требования NestJS DTO
      const rawData = this.registerForm.value;
      const registerDto = {
        userName: rawData.fullname, // Сопоставляем fullname -> userName
        email: rawData.email,
        password: rawData.password
      };

      // Отправка на ваш NestJS сервер
      this.http.post('http://localhost:3000/auth/register', registerDto)
        .subscribe({
          next: (response: any) => {
            console.log('Успешная регистрация:', response);
            // Сохраняем токен, если нужно
            localStorage.setItem('token', response.access_token);
            // Переходим на главную или страницу логина
            this.router.navigate(['/dashboard']); 
          },
          error: (err) => {
            console.error('Ошибка:', err);
            this.errorMessage = err.error?.message || 'Произошла ошибка при регистрации';
          }
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}