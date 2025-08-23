import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class BundleLocationsService {
  
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  getBundleLocation(id:string) {
    
  }
}
