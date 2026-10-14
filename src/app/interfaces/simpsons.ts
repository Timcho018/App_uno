export interface SimpsonsCharacter {
  id: number;
  age: number | null;
  birthdate: string;
  gender: string;
  name: string;
  occupation: string;
  portrait_path: string;
  phrases: string[];
  status: string;
}

export interface SimpsonsResponse {
  count: number;
  pages: number;
  prev: string | null;
  next: string | null;
  results: SimpsonsCharacter[];
}
