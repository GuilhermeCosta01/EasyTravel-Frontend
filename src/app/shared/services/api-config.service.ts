import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  
  constructor() { }

  /**
   * Retorna a URL base da API baseada no environment
   */
  getApiBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  /**
   * Retorna a URL completa para um endpoint específico
   */
  getEndpointUrl(endpoint: string): string {
    const baseUrl = this.getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Retorna a URL para endpoints de autenticação
   */
  getAuthUrl(endpoint: string = ''): string {
    const baseUrl = this.getApiBaseUrl();
    if (!endpoint || endpoint === '') {
      return `${baseUrl}/auth`;
    }
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}/auth${cleanEndpoint}`;
  }

  /**
   * Retorna a URL para endpoints da API
   */
  getApiUrl(endpoint: string = ''): string {
    const baseUrl = this.getApiBaseUrl();
    if (!endpoint || endpoint === '') {
      return `${baseUrl}/api`;
    }
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}/api${cleanEndpoint}`;
  }

  /**
   * Retorna a URL base do backend (sem /api)
   */
  getBackendBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  /**
   * Retorna a URL completa para imagens/media
   */
  getMediaUrl(mediaPath: string): string {
    if (!mediaPath) return '';
    
    const baseUrl = this.getApiBaseUrl();
    const cleanPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
    return `${baseUrl}${cleanPath}`;
  }
}
