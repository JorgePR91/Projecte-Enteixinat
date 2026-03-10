import { Component, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Supaservice } from '../../services/supaservice';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatIconModule],
  templateUrl: './app-home.html',
  styleUrl: './app-home.scss',
})
export class AppHome {
  private supaservice = inject(Supaservice);
  user: Signal<any>;
  gridCells: boolean[];

  constructor() {
    this.user = this.supaservice.getUserSession();
    // 48 cel·les per la graella decorativa del hero, ~30% activades aleatòriament
    this.gridCells = Array.from({ length: 48 }, () => Math.random() > 0.65);
  }
}
