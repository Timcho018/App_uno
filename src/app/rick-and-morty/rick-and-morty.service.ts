import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RickAndMortyCharacter, RickAndMortyResponse } from '../interfaces/rick-and-morty';

export interface RickAndMortyFilters {
  page?: number;
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
}

@Injectable({ providedIn: 'root' })
export class RickAndMortyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://rickandmortyapi.com/api';

  getCharacters(filters: RickAndMortyFilters = {}): Observable<RickAndMortyResponse> {
    let params = new HttpParams();

    if (filters.page) {
      params = params.set('page', filters.page);
    }

    if (filters.name?.trim()) {
      params = params.set('name', filters.name.trim());
    }

    if (filters.status && filters.status !== 'all') {
      params = params.set('status', filters.status);
    }

    if (filters.species?.trim()) {
      params = params.set('species', filters.species.trim());
    }

    if (filters.type?.trim()) {
      params = params.set('type', filters.type.trim());
    }

    if (filters.gender && filters.gender !== 'all') {
      params = params.set('gender', filters.gender);
    }

    return this.http.get<RickAndMortyResponse>(`${this.baseUrl}/character`, { params });
  }
}
