import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CryptoService } from './crypto.service';
import { ApiService } from './api.service';

describe('CryptoService', () => {
  let service: CryptoService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        CryptoService,
        { provide: ApiService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(CryptoService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should get cryptos from API', () => {
    const mockCryptos = [
      { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 50000, price_change_percentage_24h: 2.5, market_cap: 1000000000 }
    ];
    
    apiServiceSpy.get.and.returnValue(of(mockCryptos));
    
    service.getCryptos().subscribe(cryptos => {
      expect(cryptos).toEqual(mockCryptos);
    });
    
    expect(apiServiceSpy.get).toHaveBeenCalledWith('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
  });
});