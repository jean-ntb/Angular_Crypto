import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
/*Rôle :

- Barre de navigation principale
- Visible seulement si connecté
- Liens vers pages principales
- Bouton déconnexion*/ 
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    @if (authService.isLoggedIn()) {
      <header>
        <nav>
          <div class="nav-brand">Crypto App</div>
          <ul class="nav-links">
            <li>
              <a routerLink="/cryptos" routerLinkActive="active">Cryptos</a>
            </li>
            <li>
              <a routerLink="/profile" routerLinkActive="active">Profil</a>
            </li>
            <li>
              <a (click)="logout()" class="logout">Déconnexion</a>
            </li>
          </ul>
        </nav>
      </header>
    }
  `,
  styles: [`
    header {
      background: #333;
      color: white;
      padding: 1rem 0;
    }
    nav {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
      margin: 0;
      padding: 0;
    }
    a {
      color: white;
      text-decoration: none;
      cursor: pointer;
    }
    a:hover, a.active {
      text-decoration: underline;
    }
    .logout {
      color: #ff6b6b;
    }
    @media (max-width: 768px) {
      nav {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
// Fonction de déconnexion
  logout(): void {
    this.authService.logout();
  }
}