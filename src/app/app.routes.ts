import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PokedexComponent } from './pokedex/pokedex.component';
import { RickAndMortyComponent } from './rick-and-morty/rick-and-morty.component';
import { SimpsonsComponent } from './simpsons/simpsons.component';
import { DragonBallComponent } from './dragonball/dragonball.component';
import { HarryPotterComponent } from './harrypotter/harrypotter.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pokemon', component: PokedexComponent },
  { path: 'rick-and-morty', component: RickAndMortyComponent },
  { path: 'simpsons', component: SimpsonsComponent },
  { path: 'dragon-ball', component: DragonBallComponent },
  { path: 'harry-potter', component: HarryPotterComponent },
  { path: '**', redirectTo: '' },
];
