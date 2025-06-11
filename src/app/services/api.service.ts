import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${endpoint}`);
  } //  Effectue une requête HTTP GET vers l'URL construite à partir de environment.apiUrl et de l'endpoint. Le type de la réponse est spécifié par <T>.
// Récupérer une donnée spécifique depuis l'API 
  getMockUser(): Observable<any> {
    return this.http.get(`${environment.mockApiUrl}/users/1`);
  }
}