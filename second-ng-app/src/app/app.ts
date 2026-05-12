import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('second-ng-app');
}
