import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { DragonBallCharacter, DragonBallResponse } from '../interfaces/dragonball';

@Injectable({ providedIn: 'root' })
export class DragonBallService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://dragonball-api.com/api';

  getCharacters(): Observable<DragonBallCharacter[]> {
    return this.http.get<DragonBallResponse>(`${this.baseUrl}/characters?limit=100`).pipe(
      map((response) => response.items),
    );
  }
}
