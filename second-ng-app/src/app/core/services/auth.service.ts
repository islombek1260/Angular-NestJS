import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';

interface AuthResponse {
  access_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';
  private userSubject = new BehaviorSubject<any>(null);

  user$ = this.userSubject.asObservable();

  // Метод для обновления данных в потоке
  updateUser(user: any) {
    this.userSubject.next(user);
  }

  login(credentials: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response?.access_token) {
          localStorage.setItem('token', response.access_token);
        }
      })
    );
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
  }

  deleteAccount(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}