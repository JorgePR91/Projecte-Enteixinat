import { Component, inject, Signal, signal } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import {MatButtonModule, MatIconAnchor, MatIconButton} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Route, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Supaservice } from '../../services/supaservice';
import { toSignal } from '@angular/core/rxjs-interop';
import { StringResearch } from '../string-research/string-research';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [MatToolbar, MatToolbarRow, RouterLink, MatButtonModule, RouterLinkActive, StringResearch,  MatIconModule],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader {
  router: Router = inject(Router);
  private supaservice = inject(Supaservice);
  // Vinculat a l'input del formulari mitjançant ngModel
  searchString = '';
 public user: Signal<any>;

constructor() {
  this.user = this.supaservice.getUserSession();
}
  async logOut(){
    await this.supaservice.logOut();
    console.log('LogOut fet!');

  }
  atSearch($event: Event){
    this.router.navigate(['/plantes',this.searchString]);
  }
}
