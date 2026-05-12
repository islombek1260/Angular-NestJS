import { ChangeDetectorRef, Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../../../core/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile-modal.html',
})
export class EditProfileModalComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  public authService = inject(AuthService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  profileForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  userId: string = '';

  ngOnInit() {
    // Получаем ID пользователя из токена
    const token = this.authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded?.sub || decoded?.id;
    }

    // Инициализация формы
    this.profileForm = this.fb.group({
      userName: ['', [Validators.minLength(2)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  get displayAvatar(): string {
    if (this.previewUrl) return this.previewUrl;
    if (!this.userId) return 'assets/default-avatar.png';
    return `http://localhost:3000/users/${this.userId}/avatar`;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Мгновенное превью (твоя логика)
      this.previewUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
      this.cdr.detectChanges();
    }
  }

onSave() {
  const requests: any[] = [];
  const formValues = this.profileForm.value;

  // 1. Запрос на текстовые данные (лучше делать первым или контролировать индекс)
  const updateData: any = {};
  if (formValues.userName) updateData.userName = formValues.userName;
  if (formValues.email) updateData.email = formValues.email;
  if (formValues.password) updateData.password = formValues.password;

  // 2. Запрос на фото
  let avatarRequestIndex = -1;
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    requests.push(this.http.patch(`http://localhost:3000/users/${this.userId}/avatar`, formData));
    avatarRequestIndex = requests.length - 1;
  }

  // Добавляем основной запрос данных
  let dataRequestIndex = -1;
  if (Object.keys(updateData).length > 0) {
    requests.push(this.http.patch(`http://localhost:3000/users/${this.userId}`, updateData));
    dataRequestIndex = requests.length - 1;
  }

  if (requests.length === 0) {
    this.closeModal();
    return;
  }

  forkJoin(requests).subscribe({
    next: (results: any[]) => {
      // Проверь, что именно приходит в results
      // Ищем результат запроса данных пользователя
      const updatedUserData = dataRequestIndex !== -1 ? results[dataRequestIndex] : null;

      if (updatedUserData) {
        // Уведомляем сервис, чтобы Header мгновенно изменил имя
        this.authService.updateUser(updatedUserData);
      } else if (this.selectedFile) {
        // Если меняли только фото, можно вручную триггернуть обновление 
        // или просто отправить текущее имя из формы, чтобы поток сработал
        this.authService.updateUser({ userName: formValues.userName });
      }

      this.updated.emit(); // Уведомляем родительский компонент профиля
      this.closeModal();
    },
    error: (err) => {
      console.error('Update error:', err);
      alert('Ошибка при сохранении данных');
    }
  });
}

  closeModal() {
    if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.close.emit();
  }
}