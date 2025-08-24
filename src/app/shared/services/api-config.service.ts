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
   * Se a URL já for completa (https://), retorna ela diretamente
   */
  getMediaUrl(mediaPath: string): string {
    if (!mediaPath) return '';
    
    // Se a URL já é completa (começa com http:// ou https://), usar ela diretamente
    if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
      return mediaPath;
    }
    
    // Se é uma URL relativa, concatenar com o backend base URL
    const baseUrl = this.getBackendBaseUrl();
    const cleanPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
    return `${baseUrl}${cleanPath}`;
  }
}
