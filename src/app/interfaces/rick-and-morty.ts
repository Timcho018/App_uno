export interface RickAndMortyLocation {
  name: string;
  url: string;
}

export interface RickAndMortyCharacter {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  origin: RickAndMortyLocation;
  location: RickAndMortyLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface RickAndMortyResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: RickAndMortyCharacter[];
}
