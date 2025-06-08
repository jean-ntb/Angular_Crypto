import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from '../../../services/crypto.service';
import { Crypto } from '../../../models/crypto.interface';

@Component({
  selector: 'app-crypto-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="crypto-container">
      <h2>Cryptomonnaies</h2>
      <div *ngIf="loading" class="loading">Chargement...</div>
      <div *ngIf="cryptos.length > 0" class="crypto-grid">
        <div *ngFor="let crypto of cryptos" class="crypto-card">
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
    .positive { color: green; }
    .negative { color: red; }
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
  cryptos: Crypto[] = [];
  loading = true;

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.cryptoService.getCryptos().subscribe({
      next: (data: Crypto[]) => {
        this.cryptos = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}