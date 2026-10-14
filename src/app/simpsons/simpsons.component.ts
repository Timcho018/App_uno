import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { SimpsonsService } from './simpsons.service';
import { SimpsonsCharacter, SimpsonsResponse } from '../interfaces/simpsons';

@Component({
  selector: 'app-simpsons',
  imports: [FormsModule, RouterLink],
  templateUrl: './simpsons.component.html',
  styleUrl: './simpsons.component.css',
})
export class SimpsonsComponent implements OnInit {
  private readonly service = inject(SimpsonsService);

  readonly characters = signal<SimpsonsCharacter[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly page = signal(1);
  readonly totalPages = signal(1);

  readonly search = signal('');
  readonly selectedStatus = signal('all');
  readonly selected = signal<SimpsonsCharacter | null>(null);

  readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.characters().filter((character) => {
      const matchesQuery = !query || character.name.toLowerCase().includes(query);
      const matchesStatus = this.selectedStatus() === 'all' || character.status === this.selectedStatus();
      return matchesQuery && matchesStatus;
    });
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.service.getCharacters(this.page()).subscribe({
      next: (response: SimpsonsResponse) => {
        this.characters.set(response.results);
        this.totalPages.set(response.pages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los personajes de Springfield.');
        this.loading.set(false);
      },
    });
  }

  applyFilters(): void {
    if (this.page() !== 1) {
      this.page.set(1);
    }
    this.load();
  }

  resetFilters(): void {
    this.search.set('');
    this.selectedStatus.set('all');
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

  imageUrl(character: SimpsonsCharacter, size = 500): string {
    return `https://cdn.thesimpsonsapi.com/${size}${character.portrait_path}`;
  }

  open(character: SimpsonsCharacter): void {
    this.selected.set(character);
  }

  close(): void {
    this.selected.set(null);
  }

  capitalise(value: string): string {
    return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;
  }
}
