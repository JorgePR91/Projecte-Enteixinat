import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Signal,
  ViewChild,
} from '@angular/core';
import { Supaservice } from '../../../services/supaservice';
import * as L from 'leaflet';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MapService } from '../../../services/map-service';
import { MatCardHeader, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-planta-mapa',
  imports: [MatCardHeader, MatCardModule],
  templateUrl: './app-planta-mapa.html',
  styleUrl: './app-planta-mapa.scss',
})
export class AppPlantaMapa implements OnInit, AfterViewInit, OnDestroy {
  private supaservice: Supaservice = inject(Supaservice);
  private router = inject(Router);
  private mapService = inject(MapService);

  @ViewChild('map') mapDiv!: ElementRef;
  private map!: L.Map | undefined;
  plantes = this.supaservice.plantesSignalFiltered;
  plantesList: Signal<string[]> = computed(() => this.plantes().map((planta) => planta.nom));

  constructor(@Inject(PLATFORM_ID) private plataformaId: Object) {
    effect(() => {
      const plantes = this.plantes();
      console.log(plantes);

      if (this.map && plantes.length > 0) this.crearMarkers();
      if (!this.map) {
        return;
      }
    });
  }

  ngOnInit(): void {
    this.supaservice.getPlantes().subscribe((data) => {
      this.supaservice.setPlantes(data);
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.plataformaId)) {
      this.iniciarMapa();
      if (this.plantes().length > 0) this.crearMarkers();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  iniciarMapa() {
    this.map = this.mapService.crearMapa(this.mapDiv.nativeElement);
  }

  crearMarkers() {
    if (!this.map) return;

    this.mapService.netejarMarkers();

    this.plantes().forEach((planta) => {
      if (planta.ubicacio.lat == null && planta.ubicacio.lon == null) return;

      const myIcon = L.divIcon({
        iconUrl: 'marker.svg',
        iconSize: [30, 30],
        iconAnchor: [24, 24],
        popupAnchor: [0, -48],
      });

      const popUp = `
      <div class="infoPlanta">
        <span class="nom-planta">${planta.nom ?? 'Planta'}</span>
        <span class="cap-planta">Capacitat: ${planta.capacitat ?? 'N/A'} MW</span>
      </div>`;

      const marker = this.mapService.afegirMarker(
        planta.ubicacio.lat,
        planta.ubicacio.lon,
        myIcon,
        popUp,
      );

      marker.on('popupopen', ($event) => {
        const popupElement = $event.popup.getElement();
        const btn = popupElement?.querySelector('.botoDetall');

        if (btn) {
          btn.addEventListener('click', () => {
            this.router.navigate(['/plantes', planta.id]);
          });
        }
      });
    });
  }
}
