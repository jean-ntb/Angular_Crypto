import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Crypto } from '../models/crypto.interface';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor(private api: ApiService) {}

  getCryptos(): Observable<Crypto[]> {
    return this.api.get<Crypto[]>('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1');
  }

  getCryptoDetail(id: string): Observable<any> {
    return this.api.get<any>(`/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
  }

  getCryptoPriceHistory(id: string, days: number): Observable<any> {
    return this.api.get<any>(`/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
  }
}