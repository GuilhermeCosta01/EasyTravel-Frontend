import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HomeFilter } from '../classes/home-filter';
import { Observable } from 'rxjs';
import { Bundle } from '@/app/features/client/pages/bundle/bundle';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  homefilter: HomeFilter = new HomeFilter()

  buscarPacote(origem: string, destino: string): Observable<Bundle[]> {
    const url: string = `${this.apiConfig.getApiUrl()}/bundles-locations/route?origem=${encodeURIComponent(origem)}&destino=${encodeURIComponent(destino)}`;
    return this.http.get<Bundle[]>(url);
  }
}
