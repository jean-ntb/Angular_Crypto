import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
/*Rôle principal du AuthGuard
C'est le "videur" de l' application qui :

-Vérifie si l'utilisateur est connecté
-Autorise l'accès aux pages protégées
-Redirige vers login si non connecté
-Protège les routes sensibles*/ 
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
// Détermine si une route peut être activée ou non en fonction de l'état de connexion de l'utilisateur
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}