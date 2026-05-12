import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../interfaces/product.interface';
import { Observable } from 'rxjs';
import { FilterCriteria } from '../../components/product-filter/product-filter.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private productsService = inject(ProductsService);

  // Используем $ в конце имени для обозначения Observable
  products$!: Observable<Product[]>;

  ngOnInit(): void {
    // Просто инициализируем поток данных
    this.products$ = this.productsService.getAll();
  }
  onFilterUpdate(criteria: FilterCriteria) {
  // Например, вызываем сервис с параметрами запроса
  this.products$ = this.productsService.getAll(criteria);
}
}