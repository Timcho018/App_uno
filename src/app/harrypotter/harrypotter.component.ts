import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { HarryPotterService } from './harrypotter.service';
import { HarryPotterCharacter } from '../interfaces/harrypotter';

@Component({
  selector: 'app-harrypotter',
  imports: [FormsModule, RouterLink],
  templateUrl: './harrypotter.component.html',
  styleUrl: './harrypotter.component.css',
})
export class HarryPotterComponent implements OnInit {
  private readonly service = inject(HarryPotterService);

  readonly characters = signal<HarryPotterCharacter[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly search = signal('');
  readonly selectedHouse = signal('all');
  readonly selected = signal<HarryPotterCharacter | null>(null);

  readonly houses = computed(() =>
    [...new Set(this.characters().map((character) => character.house).filter(Boolean))].sort(),
  );

  readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.characters().filter((character) => {
      const matchesQuery =
        !query ||
        character.name.toLowerCase().includes(query) ||
        character.actor.toLowerCase().includes(query);
      const matchesHouse = this.selectedHouse() === 'all' || character.house === this.selectedHouse();
      return matchesQuery && matchesHouse;
    });
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.service.getCharacters().subscribe({
      next: (characters) => {
        this.characters.set(characters);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los personajes de Hogwarts.');
        this.loading.set(false);
      },
    });
  }

  resetFilters(): void {
    this.search.set('');
    this.selectedHouse.set('all');
  }

  open(character: HarryPotterCharacter): void {
    this.selected.set(character);
  }

  close(): void {
    this.selected.set(null);
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  houseColour(house: string): string {
    const colours: Record<string, string> = {
      Gryffindor: '#ef4444',
      Slytherin: '#22c55e',
      Ravenclaw: '#3b82f6',
      Hufflepuff: '#eab308',
    };
    return colours[house] ?? '#94a3b8';
  }
}
