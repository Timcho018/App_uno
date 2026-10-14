import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { HarryPotterCharacter } from '../interfaces/harrypotter';

@Injectable({ providedIn: 'root' })
export class HarryPotterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://hp-api.onrender.com/api';

  getCharacters(): Observable<HarryPotterCharacter[]> {
    return this.http.get<HarryPotterCharacter[]>(`${this.baseUrl}/characters`);
  }
}
