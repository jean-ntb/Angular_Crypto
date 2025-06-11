import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.interface';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  
  constructor(private router: Router) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }
 // login(email, password)
  //    Simule une connexion : si les identifiants sont bons, on connecte l’utilisateur.
  login(email: string, password: string): boolean {
    if (email === 'user@test.com' && password === 'password') {
      const user: User = {
        id: 1,
        email,
        name: 'Utilisateur Test',
        token: 'fake-jwt-token'
      };
      this.currentUser.set(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  }
// Deconnecte l’utilisateur
  // Supprime les données de l’utilisateur du service et du localStorage
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getUser(): User | null {
    return this.currentUser();
  }
}