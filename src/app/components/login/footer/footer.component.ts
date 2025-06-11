import { Component } from '@angular/core';
/*Rôle :

- Informations footer
- Copyright
- Liens utiles (futur)
- Toujours visible*/ 
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer>
      <p>&copy; 2025 Crypto App - Projet Angular</p>
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