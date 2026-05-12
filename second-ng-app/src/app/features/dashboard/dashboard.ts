import { Component } from '@angular/core';
import { HeaderComponent } from './header/header';
import { FooterComponent } from './footer/footer';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './dashboard.html'
})
export class Dashboard {}
