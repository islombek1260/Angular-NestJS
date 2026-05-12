import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
}