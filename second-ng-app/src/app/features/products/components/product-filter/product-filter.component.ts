import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface FilterCriteria {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
}

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-filter.component.html'
})
export class ProductFilterComponent implements OnInit {
  private fb = inject(FormBuilder);

  // Событие, которое передаст данные в product-list
  @Output() filterChanged = new EventEmitter<FilterCriteria>();

  filterForm: FormGroup = this.fb.group({
    search: [''],
    category: [''],
    minPrice: [null],
    maxPrice: [null]
  });

  // Список категорий (в идеале загружать с бэкенда)
  categories = ['Одежда', 'Обувь', 'Аксессуары', 'Электроника'];

  ngOnInit() {
    // Подписываемся на изменения формы
    this.filterForm.valueChanges.pipe(
      debounceTime(400), // Ждем 400мс после ввода, чтобы не спамить запросами
      distinctUntilChanged() // Срабатывает только если данные реально изменились
    ).subscribe(values => {
      this.filterChanged.emit(values);
    });
  }

  resetFilters() {
    this.filterForm.reset({
      search: '',
      category: '',
      minPrice: null,
      maxPrice: null
    });
  }
}