import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../../services/crypto.service';

@Component({
  selector: 'app-crypto-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-container">
      <button (click)="goBack()" class="back-button">← Retour</button>
      
      <div *ngIf="loading" class="loading">Chargement...</div>
      
      <div *ngIf="!loading && cryptoData" class="crypto-detail">
        <div class="crypto-header">
          <h1>{{ cryptoData.name }}</h1>
          <span class="symbol">{{ cryptoData.symbol.toUpperCase() }}</span>
        </div>
        
        <div class="price-info">
          <div class="info-card">
            <span class="label">Prix actuel</span>
            <span class="price">\${{ currentPrice.toFixed(2) }}</span>
          </div>
          <div class="info-card" [class.positive]="priceChange24h > 0" [class.negative]="priceChange24h < 0">
            <span class="label">Variation 24h</span>
            <span class="value">{{ priceChange24h.toFixed(2) }}%</span>
          </div>
          <div class="info-card">
            <span class="label">Capitalisation</span>
            <span class="value">\${{ formatNumber(marketCap) }}</span>
          </div>
          <div class="info-card">
            <span class="label">Volume 24h</span>
            <span class="value">\${{ formatNumber(volume24h) }}</span>
          </div>
        </div>

        <div class="additional-info">
          <h3>Informations supplémentaires</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Plus haut 24h:</span>
              <span>\${{ high24h.toFixed(2) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Plus bas 24h:</span>
              <span>\${{ low24h.toFixed(2) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Rang:</span>
              <span>#{{ marketCapRank }}</span>
            </div>
            <div class="info-item">
              <span class="label">Supply en circulation:</span>
              <span>{{ formatNumber(circulatingSupply) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    
    .back-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 2rem;
    }
    
    .back-button:hover {
      background: #0056b3;
    }
    
    .crypto-detail {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .crypto-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .crypto-header h1 {
      margin: 0;
    }
    
    .symbol {
      background: #f0f0f0;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
    }
    
    .price-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 3rem;
    }
    
    .info-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }
    
    .label {
      display: block;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    
    .price {
      font-size: 2rem;
      font-weight: bold;
      display: block;
    }
    
    .value {
      font-size: 1.5rem;
      font-weight: bold;
      display: block;
    }
    
    .positive .value { color: #28a745; }
    .negative .value { color: #dc3545; }
    
    .additional-info {
      margin-top: 2rem;
    }
    
    .additional-info h3 {
      margin-bottom: 1rem;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .loading {
      text-align: center;
      padding: 4rem;
    }
    
    @media (max-width: 768px) {
      .price-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CryptoDetailComponent implements OnInit {
  cryptoId: string = '';
  cryptoData: any = null;
  loading = true;
  
  // Prix et statistiques
  currentPrice: number = 0;
  priceChange24h: number = 0;
  marketCap: number = 0;
  volume24h: number = 0;
  high24h: number = 0;
  low24h: number = 0;
  marketCapRank: number = 0;
  circulatingSupply: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.cryptoId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCryptoData();
  }

  loadCryptoData(): void {
    this.loading = true;
    this.cryptoService.getCryptoDetail(this.cryptoId).subscribe({
      next: (data) => {
        this.cryptoData = data;
        this.currentPrice = data.market_data.current_price.usd;
        this.priceChange24h = data.market_data.price_change_percentage_24h;
        this.marketCap = data.market_data.market_cap.usd;
        this.volume24h = data.market_data.total_volume.usd;
        this.high24h = data.market_data.high_24h.usd;
        this.low24h = data.market_data.low_24h.usd;
        this.marketCapRank = data.market_cap_rank;
        this.circulatingSupply = data.market_data.circulating_supply;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.loading = false;
      }
    });
  }

  formatNumber(num: number): string {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  }

  goBack(): void {
    this.router.navigate(['/cryptos']);
  }
}