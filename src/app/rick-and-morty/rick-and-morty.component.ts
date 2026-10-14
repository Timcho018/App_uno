import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { RickAndMortyService } from './rick-and-morty.service';
import { RickAndMortyCharacter, RickAndMortyResponse } from '../interfaces/rick-and-morty';

type GenderFilter = 'all' | 'Female' | 'Male' | 'Genderless' | 'unknown';

@Component({
  selector: 'app-rick-and-morty',
  imports: [FormsModule, RouterLink],
  templateUrl: './rick-and-morty.component.html',
  styleUrl: './rick-and-morty.component.css',
})
export class RickAndMortyComponent implements OnInit {
  private readonly service = inject(RickAndMortyService);

  readonly characters = signal<RickAndMortyCharacter[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly totalCharacters = signal(0);

  readonly search = signal('');
  readonly selectedStatus = signal('all');
  readonly species = signal('');
  readonly selectedGender = signal<GenderFilter>('all');

  readonly selected = signal<RickAndMortyCharacter | null>(null);

  readonly hasFilters = computed(
    () => this.search().trim().length > 0 || this.selectedStatus() !== 'all' || this.species().trim().length > 0 || this.selectedGender() !== 'all',
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.service
      .getCharacters({
        page: this.page(),
        name: this.search(),
        status: this.selectedStatus(),
        species: this.species(),
        gender: this.selectedGender(),
      })
      .subscribe({
        next: (response: RickAndMortyResponse) => {
          this.characters.set(response.results);
          this.totalPages.set(response.info.pages);
          this.totalCharacters.set(response.info.count);
          this.loading.set(false);
        },
        error: () => {
          this.characters.set([]);
          this.totalCharacters.set(0);
          this.totalPages.set(1);
          this.error.set('No se encontraron personajes para los filtros actuales.');
          this.loading.set(false);
        },
      });
  }

  applyFilters(): void {
    this.page.set(1);
    this.load();
  }

  resetFilters(): void {
    this.search.set('');
    this.selectedStatus.set('all');
    this.species.set('');
    this.selectedGender.set('all');
    this.page.set(1);
    this.load();
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.page.update((value) => value - 1);
      this.load();
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((value) => value + 1);
      this.load();
    }
  }

  open(character: RickAndMortyCharacter): void {
    this.selected.set(character);
  }

  close(): void {
    this.selected.set(null);
  }

  capitalise(value: string): string {
    return value.length ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }
}
