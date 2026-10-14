import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { DragonBallService } from './dragonball.service';
import { DragonBallCharacter } from '../interfaces/dragonball';

@Component({
  selector: 'app-dragonball',
  imports: [FormsModule, RouterLink],
  templateUrl: './dragonball.component.html',
  styleUrl: './dragonball.component.css',
})
export class DragonBallComponent implements OnInit {
  private readonly service = inject(DragonBallService);

  readonly characters = signal<DragonBallCharacter[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly search = signal('');
  readonly selectedRace = signal('all');
  readonly selectedGender = signal('all');
  readonly selected = signal<DragonBallCharacter | null>(null);

  readonly races = computed(() => [...new Set(this.characters().map((character) => character.race))].sort());
  readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.characters().filter((character) => {
      const matchesQuery = !query || character.name.toLowerCase().includes(query);
      const matchesRace = this.selectedRace() === 'all' || character.race === this.selectedRace();
      const matchesGender = this.selectedGender() === 'all' || character.gender === this.selectedGender();
      return matchesQuery && matchesRace && matchesGender;
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
        this.error.set('No se pudieron cargar los personajes de Dragon Ball.');
        this.loading.set(false);
      },
    });
  }

  resetFilters(): void {
    this.search.set('');
    this.selectedRace.set('all');
    this.selectedGender.set('all');
  }

  open(character: DragonBallCharacter): void {
    this.selected.set(character);
  }

  close(): void {
    this.selected.set(null);
  }

  capitalise(value: string): string {
    return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;
  }
}
