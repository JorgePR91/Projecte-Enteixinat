import { Component, effect, inject, input, Signal, signal } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { carregarPlantesDemo } from '../../../services/planta-demo';
import { AppPlantaCard } from '../app-planta-card/app-planta-card';
import { Supaservice } from '../../../services/supaservice';
import { from } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Planta } from '../../../interfaces/planta';

/**
 * El component fa peticions síncones però la petició les fa asíncrones, i de normal les segones es fan després de que el primer estiga construït (després del constructor) ==> ngOnInit. Aquest component és similar al ConnectedCallback, però en compte de disparar-se al conectar-se al DOM, ho fa quan es crea (abans d'estar al DOM).
 */

@Component({
  selector: 'app-planta-grid',
  imports: [MatGridListModule, MatButtonModule, RouterLink, AppPlantaCard],
  templateUrl: './app-planta-grid.html',
  styleUrl: './app-planta-grid.scss',
})
export class AppPlantaGrid {
  private supaservice: Supaservice = inject(Supaservice);
  //public user: Signal<any>;

  /**
   * Atributs que es creen al construir-se, encara que no hi haja una funció constructora
   * Mètode 1: rebre un obserbable
   * Observable -> ngOnInit()
   *
   *   itemsSubscription?: Subscription;
   */
  //public plantas = signal<Planta[]>([]);
  public plantas = this.supaservice.plantesSignalFiltered;
  //AGAFAR PARÀMETRE
  //public id = input<string>('');
  public destacats = signal(0);

  onDestacarChange(estaDestacat: boolean) {
    this.destacats.update(n => estaDestacat ? n + 1 : n - 1);
  }

  constructor() {
    // this.user = this.supaservice.getUserSession();
    // this.supaservice
    //   .getFindByValueStringSupabase('plantes', 'usuari', this.user().id)
    //   .then((response) => this.plantas.set(response));

    // console.log(this.plantas());

    // this.destacats = 0;

  }

  async ngOnInit() {
    /**
   * @description Mètode 1: instanciem el servei i ens subscrivim amb el callback de assignar el resultat a la variables de plantes [+]
   *
   * this.itemsSubscription = this.supaservice.getPlantes().subscribe(
      (plantesSubscribe: Planta[]) => {
        this.items.set(plantesSubscribe);
      }
    );
   */
    //const user = this.supaservice.getUserSession();
    //onsole.log(user);
    //   this.supaservice.getFindByValueStringSupabase('plantes', 'usuari', this.user().id).then(response => this.items.set(response));
    //   console.log(this.items());
    //  this.destacats = 0;
    /**
     * @description Mètode per a omplir la base de dades de plantes demo si està buida
     */
    //carregarPlantesDemo(this.supaservice);
  }

  /**
   * Mètode 2: convertir a Signal. ToSignal converteix observables en Signals, no cal posar-ho en el onInit
   * Observable -> Signal
   */

  /**
   * Mètode 3: fer funció en el servei que convertisca ja en l'objecte dessitjat. Fent ús de httpResource, fa la petició i retorna un Singal no un Observable.
   * httpResource -> Signal
   */

  //  SUPABASE (SELECT  auth.uuid() AS uuid="user")
}
