import { GeolocalitzacioService } from '../../../services/geolocalitzacio-service';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField, min, minLength, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Planta } from '../../../interfaces/planta';
import { Supaservice } from '../../../services/supaservice';

type PlantaNova = {
  nom: string;
  latitud: number;
  longitud: number;
  capacitat: number;
  foto: string;
};

@Component({
  selector: 'app-planta-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatButtonModule,
    FormField,
  ],
  templateUrl: './app-planta-create.html',
  styleUrl: './app-planta-create.scss',
  standalone: true,
})
export class AppCreateForm {
  private supaservice = inject(Supaservice);
  private router = inject(Router);

  formModel = signal<PlantaNova>({
    nom: '',
    latitud: 0,
    longitud: 0,
    capacitat: 0,
    foto: '',
  });

  plantaForm = form(this.formModel, (schema) => {
    required(schema.nom);
    required(schema.latitud);
    required(schema.longitud);
    required(schema.capacitat);
    min(schema.capacitat, 1);
    minLength(schema.nom, 3, { message: 'El nom ha de tindre mínim 3 caràcters' });
  });

  protected arxiuFoto = signal<File | null>(null);
  protected previsualitzacio = signal<string>('');
  protected pujant = signal(false);
  protected error = signal<string>('');

 constructor(private GeolocalitzacioService: GeolocalitzacioService) {}


  obtenerUbicacion() {
    this.GeolocalitzacioService.getCurrentPosition()
      .then(pos => {
      this.formModel.update(m => ({
        ...m,
        latitud: pos.coords.latitude,
        longitud: pos.coords.longitude,
      }));
    })
      .catch(err => {
        this.error.set(String(err));
      });
  }

  protected enSeleccionarFitxer(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const fitxer = input.files[0];
    this.arxiuFoto.set(fitxer);
    this.previsualitzacio.set(URL.createObjectURL(fitxer));
  }

  protected async crear(event: Event) {
    event.preventDefault();
    if (!this.plantaForm().valid()) return;

    const { nom, latitud, longitud, capacitat } = this.formModel();

    const novaPlanta: Planta = {
      id: 0,
      created_at: 0,
      nom,
      ubicacio: { lat: latitud, lon: longitud },
      capacitat: +capacitat,
      foto: '',
      usuari: this.supaservice.userSession()?.id ?? '',
      favorite: false,
    };

    this.pujant.set(true);
    await this.supaservice.createPlanta(novaPlanta, this.arxiuFoto());
    this.pujant.set(false);
    this.router.navigate(['/plantes/detall']);
  }

  protected tornar() {
    this.router.navigate(['/plantes/detall']);
  }
}
