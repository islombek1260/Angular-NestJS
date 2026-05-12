import { Component } from '@angular/core';
import { HeaderComponent } from '../dashboard/header/header';
import { FooterComponent } from '../dashboard/footer/footer';

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './products.html',
})
export class Products {}