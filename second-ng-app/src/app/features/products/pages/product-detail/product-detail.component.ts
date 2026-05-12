import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product, ProductVariant } from '../../interfaces/product.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  imports: [CommonModule],
  standalone: true
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);

  product?: Product;
  selectedColor?: string;
  availableVariants: ProductVariant[] = [];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productsService.getById(id).subscribe(data => {
        this.product = data;
        // По умолчанию выбираем первый доступный цвет
        if (data.variants.length > 0) {
          this.selectColor(data.variants[0].color);
        }
      });
    }
  }

  selectColor(color: string) {
    this.selectedColor = color;
    // Фильтруем варианты под выбранный цвет
    this.availableVariants = this.product?.variants.filter(v => v.color === color) || [];
  }
}