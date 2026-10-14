import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PokeApiService } from './pokeapi.service';
import { Pokemon, PokemonSpecies } from '../interfaces/pokemon';

type SpriteView = 'artwork' | 'front' | 'back' | 'shiny-front' | 'shiny-back';

@Component({
  selector: 'app-pokedex',
  imports: [FormsModule, RouterLink],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.css',
})
export class PokedexComponent implements OnInit {
  private readonly pokeApi = inject(PokeApiService);

  readonly pokemons = signal<Pokemon[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly search = signal('');
  readonly selectedType = signal('');
  readonly selected = signal<Pokemon | null>(null);
  readonly selectedSprite = signal<SpriteView>('artwork');
  readonly speciesText = signal<string | null>(null);
  readonly speciesLoading = signal(false);
  readonly selectedAccent = computed(() => this.accentFor(this.selected()?.types[0]?.type.name ?? 'normal'));

  readonly spriteOptions: { id: SpriteView; label: string }[] = [
    { id: 'artwork', label: 'Artwork' },
    { id: 'front', label: 'Frontal' },
    { id: 'back', label: 'Trasero' },
    { id: 'shiny-front', label: 'Shiny' },
    { id: 'shiny-back', label: 'Shiny trasero' },
  ];

  pokemonIndex(pokemon: Pokemon): number {
    return this.pokemons().findIndex((item) => item.id === pokemon.id);
  }

  prevPokemon(): void {
    const current = this.selected();
    if (!current) return;
    const list = this.pokemons();
    const index = this.pokemonIndex(current);
    const next = index > 0 ? index - 1 : list.length - 1;
    this.open(list[next]);
  }

  nextPokemon(): void {
    const current = this.selected();
    if (!current) return;
    const list = this.pokemons();
    const index = this.pokemonIndex(current);
    const next = index >= 0 && index < list.length - 1 ? index + 1 : 0;
    this.open(list[next]);
  }

  accentFor(type: string): string {
    const colors: Record<string, string> = {
      normal: '#94a3b8',
      fire: '#f97316',
      water: '#3b82f6',
      electric: '#eab308',
      grass: '#22c55e',
      ice: '#67e8f9',
      fighting: '#dc2626',
      poison: '#a855f7',
      ground: '#ca8a04',
      flying: '#818cf8',
      psychic: '#ec4899',
      bug: '#84cc16',
      rock: '#78716c',
      ghost: '#6366f1',
      dragon: '#7c3aed',
      dark: '#1f2937',
      steel: '#64748b',
      fairy: '#f472b6',
    };
    return colors[type] ?? colors['normal'];
  }

  spriteUrl(pokemon: Pokemon): string {
    switch (this.selectedSprite()) {
      case 'front':
        return pokemon.sprites.front_default ?? this.imageUrl(pokemon);
      case 'back':
        return pokemon.sprites.back_default ?? pokemon.sprites.front_default ?? this.imageUrl(pokemon);
      case 'shiny-front':
        return pokemon.sprites.front_shiny ?? pokemon.sprites.front_default ?? this.imageUrl(pokemon);
      case 'shiny-back':
        return pokemon.sprites.back_shiny ?? pokemon.sprites.back_default ?? this.imageUrl(pokemon);
      default:
        return this.imageUrl(pokemon);
    }
  }

  readonly types = computed(() =>
    [...new Set(this.pokemons().flatMap((pokemon) => pokemon.types.map((slot) => slot.type.name)))].sort(),
  );

  readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();

    return this.pokemons().filter((pokemon) => {
      const matchesSearch =
        query.length === 0 || pokemon.name.includes(query) || String(pokemon.id) === query;

      const matchesType =
        this.selectedType().length === 0 || pokemon.types.some((slot) => slot.type.name === this.selectedType());

      return matchesSearch && matchesType;
    });
  });

  ngOnInit(): void {
    this.load();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.selected()) {
      this.close();
    }
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.pokeApi.getPokemons(151).subscribe({
      next: (pokemons: Pokemon[]) => {
        this.pokemons.set(pokemons);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la Pokédex. Inténtalo de nuevo.');
        this.loading.set(false);
      },
    });
  }

  resetFilters(): void {
    this.search.set('');
    this.selectedType.set('');
  }

  open(pokemon: Pokemon): void {
    this.selected.set(pokemon);
    this.selectedSprite.set('artwork');
    this.speciesText.set(null);
    this.speciesLoading.set(true);

    this.pokeApi.getSpecies(pokemon.id).subscribe({
      next: (species) => {
        const entry = species.flavor_text_entries.find((item) => item.language.name === 'es') ??
          species.flavor_text_entries.find((item) => item.language.name === 'en');

        this.speciesText.set(entry?.flavor_text.replace(/\s+/g, ' ') ?? null);
        this.speciesLoading.set(false);
      },
      error: () => {
        this.speciesLoading.set(false);
      },
    });
  }

  close(): void {
    this.selected.set(null);
    this.speciesText.set(null);
  }

  statName(name: string): string {
    return name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  statValue(pokemon: Pokemon, statName: string): number {
    return pokemon.stats.find((stat) => stat.stat.name === statName)?.base_stat ?? 0;
  }

  imageUrl(pokemon: Pokemon): string {
    return (
      pokemon.sprites.other?.['official-artwork']?.front_default ??
      pokemon.sprites.front_default ??
      ''
    );
  }

  capitalise(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
