import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/login/footer/footer.component';
import { HeaderComponent } from './components/login/header/header.component';

/*Rôle :

C'est le composant racine de  application
Tous les autres composants sont ses enfants
Contient la logique TypeScript du composant principal
Définit la structure générale de l'app (header, router-outlet, footer) */ 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-container">
      <app-header />
      <main>
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    main {
      flex: 1;
      background: #f5f5f5;
    }
  `]
})
export class AppComponent {}