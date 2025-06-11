import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Crypto } from '../models/crypto.interface';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor(private api: ApiService) {}
//  la liste des 50 plus grandes cryptos en dollars.
  getCryptos(): Observable<Crypto[]> {
    return this.api.get<Crypto[]>('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1');
  }
// Voir une crypto en détail
  getCryptoDetail(id: string): Observable<any> {
    return this.api.get<any>(`/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
  }
// On veut l’historique des prix d’une crypto, soit pour un nombre de jours,
  // soit “max” pour tout l’historique disponible.
  getCryptoPriceHistory(id: string, days: number | string): Observable<any> {
    const daysParam = days === 'max' ? 'max' : days;
    return this.api.get<any>(`/coins/${id}/market_chart?vs_currency=usd&days=${daysParam}`);
  }
}