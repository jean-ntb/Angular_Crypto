import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { CryptoService } from '../../../services/crypto.service';

Chart.register(...registerables);
/* Rôle :

- Affiche détails complets d'une crypto
- Graphique d'évolution (Chart.js)
- Statistiques détaillées
- Historique des prix*/ 
@Component({
  selector: 'app-crypto-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-container">
      <button (click)="goBack()" class="back-button">← Retour</button>
      
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement des données...</p>
      </div>
      
      <div *ngIf="!loading && cryptoData" class="crypto-detail">
        <div class="crypto-header">
          <div class="header-left">
            <h1>{{ cryptoData.name }}</h1>
            <span class="symbol">{{ cryptoData.symbol.toUpperCase() }}</span>
          </div>
          <div class="header-right">
            <span class="rank">Rang #{{ cryptoData.market_cap_rank }}</span>
          </div>
        </div>
        
        <div class="price-section">
          <div class="current-price">
            <span class="price-value">\${{ currentPrice.toFixed(2) }}</span>
            <span class="price-change" [class.positive]="priceChange24h > 0" [class.negative]="priceChange24h < 0">
              <span *ngIf="priceChange24h > 0">▲</span>
              <span *ngIf="priceChange24h < 0">▼</span>
              {{ Math.abs(priceChange24h).toFixed(2) }}% (24h)
            </span>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Cap. Marché</span>
            <span class="stat-value">\${{ formatNumber(marketCap) }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Volume 24h</span>
            <span class="stat-value">\${{ formatNumber(volume24h) }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Plus haut 24h</span>
            <span class="stat-value">\${{ high24h.toFixed(2) }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Plus bas 24h</span>
            <span class="stat-value">\${{ low24h.toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="chart-section">
          <h3>Évolution du prix</h3>
          <div class="time-buttons">
            <button *ngFor="let range of timeRanges" 
                    (click)="changeTimeRange(range.value)"
                    [class.active]="selectedRange === range.value"
                    class="time-btn">
              {{ range.label }}
            </button>
          </div>
          <div class="chart-container">
            <canvas id="priceChart"></canvas>
          </div>
        </div>

        <div class="additional-info">
          <h3>Informations supplémentaires</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Supply en circulation</span>
              <span class="info-value">{{ formatNumber(circulatingSupply) }} {{ cryptoData.symbol.toUpperCase() }}</span>
            </div>
            <div class="info-item" *ngIf="totalSupply">
              <span class="info-label">Supply totale</span>
              <span class="info-value">{{ formatNumber(totalSupply) }} {{ cryptoData.symbol.toUpperCase() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">ATH (Plus haut historique)</span>
              <span class="info-value">\${{ ath.toFixed(2) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date ATH</span>
              <span class="info-value">{{ formatDate(athDate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    
    .back-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 2rem;
      font-size: 1rem;
      transition: all 0.3s;
    }
    
    .back-button:hover {
      background: #0056b3;
      transform: translateX(-5px);
    }
    
    .crypto-detail {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    
    .crypto-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .crypto-header h1 {
      margin: 0;
      font-size: 2rem;
    }
    
    .symbol {
      background: #f0f0f0;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: bold;
      font-size: 1.1rem;
    }
    
    .rank {
      background: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: bold;
    }
    
    .price-section {
      margin-bottom: 2rem;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .current-price {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .price-value {
      font-size: 3rem;
      font-weight: bold;
    }
    
    .price-change {
      font-size: 1.2rem;
      font-weight: 500;
    }
    
    .positive { color: #28a745; }
    .negative { color: #dc3545; }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 3rem;
    }
    
    .stat-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }
    
    .stat-label {
      display: block;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    
    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .chart-section {
      margin-bottom: 3rem;
    }
    
    .chart-section h3 {
      margin-bottom: 1rem;
    }
    
    .time-buttons {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    
    .time-btn {
      background: #e9ecef;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
    }
    
    .time-btn:hover {
      background: #dee2e6;
    }
    
    .time-btn.active {
      background: #007bff;
      color: white;
    }
    
    .chart-container {
      position: relative;
      height: 400px;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
    }
    
    .additional-info h3 {
      margin-bottom: 1rem;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .info-label {
      color: #666;
    }
    
    .info-value {
      font-weight: bold;
    }
    
    .loading {
      text-align: center;
      padding: 4rem;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .crypto-header h1 {
        font-size: 1.5rem;
      }
      
      .price-value {
        font-size: 2rem;
      }
      
      .chart-container {
        height: 300px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class CryptoDetailComponent implements OnInit, OnDestroy {
  cryptoId: string = '';
  cryptoData: any = null;
  loading = true;
  chart: Chart | null = null;
  selectedRange: number | string = 7;
  Math = Math;
  
  // Prix et statistiques de la crypto
  currentPrice: number = 0;
  priceChange24h: number = 0;
  marketCap: number = 0;
  volume24h: number = 0;
  high24h: number = 0;
  low24h: number = 0;
  marketCapRank: number = 0;
  circulatingSupply: number = 0;
  totalSupply: number = 0;
  ath: number = 0;
  athDate: string = '';

  // liste des intervalles de temps pour le graphique
  timeRanges = [
    { label: '24h', value: 1 },
    { label: '7j', value: 7 },
    { label: '30j', value: 30 },
    { label: '90j', value: 90 },
    { label: '1an', value: 365 },
    { label: 'Max', value: 'max' as const }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cryptoService: CryptoService
  ) {}
  
/*ngOnInit()
Récupère l’id de la crypto directement dans l’URL.

Lance loadCryptoData() pour aller chercher toutes les infos.

*/ 
  ngOnInit(): void {
    this.cryptoId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCryptoData();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
/*loadPriceHistory
Demande à l’API l’historique de prix pour l’intervalle voulu.

Quand les données arrivent, appelle createChart() pour (re)dessiner le graphique.

Gère l’état loading et les erreurs comme plus haut.*/ 

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
        this.totalSupply = data.market_data.total_supply;
        this.ath = data.market_data.ath.usd;
        this.athDate = data.market_data.ath_date.usd;
        this.loadPriceHistory(this.selectedRange);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.loading = false;
      }
    });
  }
// Charger l'historique des prix pour la crypto sélectionnée
  loadPriceHistory(days: number | string): void {
    this.cryptoService.getCryptoPriceHistory(this.cryptoId, days).subscribe({
      next: (data) => {
        this.createChart(data.prices);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.loading = false;
      }
    });
  }
// Créer le graphique avec Chart.js
  createChart(prices: number[][]): void {
    // Get element canvas
    const ctx = document.getElementById('priceChart') as HTMLCanvasElement;
    
    if (this.chart) {
      this.chart.destroy();
    }

    // Préparer les données pour les labels et les valeurs
    // et les afficher dans le format approprié
    const labels = prices.map(price => {
      const date = new Date(price[0]);
      if (this.selectedRange === 1) {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      } else if (typeof this.selectedRange === 'number' && this.selectedRange <= 30) {
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      } else {
        return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      }
    });

    const data = prices.map(price => price[1]);

    // Créer le graphique
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Prix (USD)',
          data: data,

          // Configuration du style du graphique
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#007bff',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: {
              size: 14
            },
            bodyFont: {
              size: 14
            },
            callbacks: {
              label: function(context) {
                return 'Prix: $' + context.parsed.y.toFixed(2);
              }
            }
          }
        },
        // Configuration des axes X et Y
        scales: {
          x: { // Le temps
            grid: {
              display: false
            },
            ticks: {
              maxTicksLimit: 8,
              font: {
                size: 12
              }
            }
          },
          y: { // Le prix
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                size: 12
              },
              callback: function(value: any) {
                const numValue = typeof value === 'number' ? value : parseFloat(value.toString());
                if (numValue >= 1000) {
                  return '$' + (numValue / 1000).toFixed(0) + 'k';
                }
                return '$' + numValue.toFixed(numValue < 10 ? 2 : 0);
              }
            }
          }
        }
      }
    });
  }
// Changer l'intervalle de temps pour le graphique
  changeTimeRange(days: number | string): void {
    this.selectedRange = days;
    this.loadPriceHistory(days);
  }
// Formater les nombres pour l'affichage en fonction de leur ordre de granduer
  formatNumber(num: number): string {
    if (!num) return '0';
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  }
// Formater les dates aux dates françaises pour l'affichage
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  goBack(): void {
    this.router.navigate(['/cryptos']);
  }
}