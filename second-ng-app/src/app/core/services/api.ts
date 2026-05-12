// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:3000'; // URL вашего бэкенда

  constructor(private http: HttpClient) {}

  // Метод для получения данных
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/items`);
  }

  // Метод для отправки данных (например, логин или пост)
  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, data);
  }
}