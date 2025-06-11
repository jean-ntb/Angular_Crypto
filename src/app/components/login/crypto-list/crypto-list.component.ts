import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CryptoService } from '../../../services/crypto.service';
import { Crypto } from '../../../models/crypto.interface';

/*Rôle :

- Affiche toutes les cryptomonnaies
- Barre de recherche/filtrage
- Navigation vers le détail
- Mise à jour temps réel */
@Component({
  selector: 'app-crypto-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="crypto-container">
      <h2>Cryptomonnaies</h2>
      
      <!-- Barre de recherche -->
      <div class="search-container">
        <input 
          type="text" 
          [(ngModel)]="searchTerm"
          (ngModelChange)="filterCryptos()"
          placeholder="Rechercher une crypto (nom ou symbole)..."
          class="search-input">
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>
      
      <div *ngIf="!loading && filteredCryptos.length === 0 && searchTerm" class="no-results">
        Aucun résultat pour "{{ searchTerm }}"
      </div>

      <div *ngIf="filteredCryptos.length > 0" class="crypto-grid">
        <div *ngFor="let crypto of filteredCryptos" 
             class="crypto-card"
             (click)="viewCryptoDetail(crypto.id)">
          <h3>{{ crypto.name }}</h3>
          <p class="symbol">{{ crypto.symbol.toUpperCase() }}</p>
          <p class="price">\${{ crypto.current_price.toFixed(2) }}</p>
          <p [class.positive]="crypto.price_change_percentage_24h > 0"
             [class.negative]="crypto.price_change_percentage_24h < 0">
            {{ crypto.price_change_percentage_24h.toFixed(2) }}%
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .crypto-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    
    .search-container {
      margin: 2rem 0;
    }
    
    .search-input {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      transition: border-color 0.3s;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #007bff;
    }
    
    .no-results {
      text-align: center;
      padding: 3rem;
      color: #666;
      font-size: 1.1rem;
    }
    
    .crypto-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .crypto-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    
    .crypto-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    }
    
    .symbol {
      color: #666;
      font-size: 0.9rem;
    }
    
    .price {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 1rem 0;
    }
    
    .positive { color: #28a745; }
    .negative { color: #dc3545; }
    
    .loading {
      text-align: center;
      padding: 2rem;
    }
    
    @media (max-width: 768px) {
      .crypto-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})

export class CryptoListComponent implements OnInit {
  cryptos: Crypto[] = []; /** Liste complète des cryptomonnaies récupérées depuis l'API */
  filteredCryptos: Crypto[] = []; /** Liste complète des cryptomonnaies récupérées depuis l'API */
  searchTerm: string = '';
  loading = true;

  constructor(
    private cryptoService: CryptoService,
    private router: Router
  ) {}
// Récupère les cryptomonnaies au chargement du composant
  ngOnInit(): void {
    this.cryptoService.getCryptos().subscribe({
      next: (data: Crypto[]) => {
        this.cryptos = data;
        this.filteredCryptos = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
// Filtre les cryptomonnaies en fonction du terme de recherche
  filterCryptos(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCryptos = this.cryptos;
      return;
    }

    const search = this.searchTerm.toLowerCase();
    this.filteredCryptos = this.cryptos.filter(crypto => 
      crypto.name.toLowerCase().includes(search) || 
      crypto.symbol.toLowerCase().includes(search)
    );
  }

  viewCryptoDetail(cryptoId: string): void {
    this.router.navigate(['/crypto', cryptoId]);
  }
}