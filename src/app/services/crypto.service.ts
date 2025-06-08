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
    return this.api.get<Crypto[]>('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
  }
}