import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";

@Component({
  selector: 'app-footer',
  imports: [MatToolbar, MatToolbarRow],
  templateUrl: './app-footer.html',
  styleUrl: './app-footer.scss',
})
export class AppFooter {

}
