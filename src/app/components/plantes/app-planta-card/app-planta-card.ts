import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Planta } from '../../../interfaces/planta';
import { RouterLink } from '@angular/router';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-planta-card',
  imports: [MatCardModule, MatButtonModule, RouterLink, NgClass, NgStyle],
  templateUrl: './app-planta-card.html',
  styleUrl: './app-planta-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppPlantaCard {
// El operador "!" le dice a TypeScript que confíe en que
// Angular asignará esta propiedad (@Input) antes de usarla.
//
// Sin esto, TypeScript lanza el error TS2564:
// "Property 'planta' has no initializer and is not definitely assigned in the constructor."
//
// Se usa comúnmente en @Input() porque el valor viene del
// componente padre **después** de instanciar este componente.
//
// Alternativa: usar "planta?: Planta" y el operador "?." en el template
// si quieres permitir que sea opcional.
  //@Input() planta!: Planta;
  planta = input.required<Planta>();
  destacada = signal(false);
  destacarChange = output<boolean>();

  getImageUrl(): string {
    return this.planta().foto || `https://placehold.co/300x300/orange/white?text=${encodeURIComponent(this.planta().nom)}`;
  }

  toggleDestacar() {
    this.destacada.update(v => !v);
    this.destacarChange.emit(this.destacada());
  }

  getCapacitatColor(): string {
    const cap = this.planta().capacitat ?? 0;
    if (cap >= 10) return 'green';
    if (cap >= 5) return 'orange';
    return 'red';
  }
}
