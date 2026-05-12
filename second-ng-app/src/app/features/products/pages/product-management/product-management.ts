import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.html'
})
export class ProductManagementComponent {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private router = inject(Router);

  // Основная форма
  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    baseImage: ['', Validators.required],
    // Массив вариантов (цвета, размеры)
    variants: this.fb.array([]) 
  });

  // Геттер для удобного доступа к массиву вариантов в шаблоне
  get variants() {
    return this.productForm.get('variants') as FormArray;
  }

  // Метод для создания новой группы полей варианта
  addVariant() {
    const variantForm = this.fb.group({
      color: ['', Validators.required],
      size: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      sku: ['', Validators.required]
    });
    this.variants.push(variantForm);
  }

  // Удаление варианта из списка
  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.productsService.create(this.productForm.value).subscribe({
        next: () => {
          alert('Товар успешно создан!');
        },
        error: (err) => console.error('Ошибка при создании:', err)
      });
    }
  }
}