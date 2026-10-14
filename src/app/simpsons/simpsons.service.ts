import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpsonsCharacter, SimpsonsResponse } from '../interfaces/simpsons';

@Injectable({ providedIn: 'root' })
export class SimpsonsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://thesimpsonsapi.com/api';

  getCharacters(page = 1): Observable<SimpsonsResponse> {
    const params = new HttpParams().set('page', page);
    return this.http.get<SimpsonsResponse>(`${this.baseUrl}/characters`, { params });
  }
}
