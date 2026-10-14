import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable, of, switchMap } from 'rxjs';

import { Pokemon, PokemonListResponse, PokemonSpecies } from '../interfaces/pokemon';

@Injectable({ providedIn: 'root' })
export class PokeApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  getPokemons(limit = 151, offset = 0): Observable<Pokemon[]> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`).pipe(
      switchMap((response) => {
        if (!response.results.length) {
          return of([]);
        }

        return forkJoin(response.results.map((item) => this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${item.name}`)));
      }),
    );
  }

  getSpecies(nameOrId: string | number): Observable<PokemonSpecies> {
    return this.http.get<PokemonSpecies>(`${this.baseUrl}/pokemon-species/${nameOrId}`);
  }
}
