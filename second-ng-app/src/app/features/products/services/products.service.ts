import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../../../environments/environment';
import { FilterCriteria } from '../components/product-filter/product-filter.component';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getAll(criteria: FilterCriteria) {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(productData: Partial<Product>) {
    return this.http.post<Product>(this.apiUrl, productData);
  }
}