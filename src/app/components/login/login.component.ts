import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
/*Rôle :

- Affiche le formulaire de connexion
- Capture email/mot de passe
- Communique avec AuthService
- Redirige après connexion réussi */ 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Connexion</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email"
              class="form-control"
              required>
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              class="form-control"
              required>
          </div>
          <div *ngIf="error" class="error">
            Email ou mot de passe incorrect
          </div>
          <button type="submit" class="btn btn-primary">Se connecter</button>
        </form>
        <p class="hint">Email: user&#64;test.com / Mot de passe: password</p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 120px);
    }
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary {
      background: #007bff;
      color: white;
    }
    .error {
      color: red;
      margin-bottom: 1rem;
    }
    .hint {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #666;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
// Rôle : Gère la soumission du formulaire de connexion
  // Vérifie les identifiants via AuthService
  // Redirige vers /cryptos si succès, sinon affiche une erreur
  onSubmit(): void {
    if (this.authService.login(this.email, this.password)) {
      this.router.navigate(['/cryptos']);
    } else {
      this.error = true;
    }
  }
}