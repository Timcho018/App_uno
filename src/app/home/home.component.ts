import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly pokemonCoverFailed = signal(false);
  readonly rickCoverFailed = signal(false);

  readonly stars = Array.from({ length: 54 }, (_, index) => ({
    left: (index * 37 + 13) % 100,
    top: (index * 61 + 7) % 100,
    size: (index % 3) + 1,
    delay: (index % 9) * 0.35,
    duration: 3.5 + (index % 5),
  }));

  hideImage(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.style.display = 'none';
  }
}
