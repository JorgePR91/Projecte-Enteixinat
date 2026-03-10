import { Supaservice } from './../../services/supaservice';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'string-research',
  imports: [FormsModule],
  templateUrl: './string-research.html',
  styleUrl: './string-research.scss',
})
export class StringResearch {
  supaservice: Supaservice = inject(Supaservice);
  recerca: string = '';

  onSearch() {
    this.supaservice.setRecerca(this.recerca);
  }
}
