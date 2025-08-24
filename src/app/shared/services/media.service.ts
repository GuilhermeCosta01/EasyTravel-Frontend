import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaResponse } from '../models/media-response.interface';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  // Criar nova mídia para um bundle (sem autenticação)
  createBundleMedia(bundleId: number, mediaUrl: string, mediaType: string = 'IMAGE'): Observable<MediaResponse> {
    const mediaData = {
      mediaType: mediaType.toUpperCase(), // Garantir que seja maiúsculo (IMAGE ou VIDEO)
      mediaUrl: mediaUrl,
      bundleId: bundleId
    };
    
    // Headers que sinalizam para o interceptor não adicionar autenticação
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    console.log('MediaService - Criando mídia sem autenticação:', mediaData);
    return this.http.post<MediaResponse>(this.apiConfig.getApiUrl() + "/medias", mediaData, { headers });
  }

  // Atualizar mídia existente (sem autenticação)
  updateBundleMedia(mediaId: number, mediaUrl: string, mediaType: string = 'IMAGE'): Observable<MediaResponse> {
    const url = `${this.apiConfig.getApiUrl()}/medias/${mediaId}`;
    const mediaData = {
      mediaType: mediaType.toUpperCase(), // Garantir que seja maiúsculo (IMAGE ou VIDEO)
      mediaUrl: mediaUrl
    };
    
    // Headers que sinalizam para o interceptor não adicionar autenticação
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    console.log('MediaService - Atualizando mídia sem autenticação:', mediaData);
    return this.http.put<MediaResponse>(url, mediaData, { headers });
  }

  // Buscar mídia de um bundle
  getBundleMedia(bundleId: number): Observable<MediaResponse[]> {
    const url = `${this.apiConfig.getApiUrl()}/medias/images/bundle/${bundleId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.get<MediaResponse[]>(url, { headers });
  }

  // Métodos de conveniência para tipos específicos de mídia

  // Criar nova imagem para um bundle
  createBundleImage(bundleId: number, imageUrl: string): Observable<MediaResponse> {
    return this.createBundleMedia(bundleId, imageUrl, 'IMAGE');
  }

  // Criar novo vídeo para um bundle
  createBundleVideo(bundleId: number, videoUrl: string): Observable<MediaResponse> {
    return this.createBundleMedia(bundleId, videoUrl, 'VIDEO');
  }

  // Atualizar imagem existente
  updateBundleImage(mediaId: number, imageUrl: string): Observable<MediaResponse> {
    return this.updateBundleMedia(mediaId, imageUrl, 'IMAGE');
  }

  // Atualizar vídeo existente
  updateBundleVideo(mediaId: number, videoUrl: string): Observable<MediaResponse> {
    return this.updateBundleMedia(mediaId, videoUrl, 'VIDEO');
  }
}
