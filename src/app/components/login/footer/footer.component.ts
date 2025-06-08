import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer>
      <p>&copy; 2024 Crypto App - Projet Angular</p>
    </footer>
  `,
  styles: [`
    footer {
      background: #f8f9fa;
      text-align: center;
      padding: 1rem;
      margin-top: auto;
    }
    p {
      margin: 0;
      color: #666;
    }
  `]
})
export class FooterComponent {}