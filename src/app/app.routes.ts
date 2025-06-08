import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/login/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'cryptos', 
    loadComponent: () => import('./components/login/crypto-list/crypto-list.component').then(m => m.CryptoListComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];