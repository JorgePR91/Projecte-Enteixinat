import { Component, output, inject, input, linkedSignal, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField, min, minLength, readonly, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { Planta } from '../../../interfaces/planta';
import { Supaservice } from '../../../services/supaservice';

type PlantaEdit = Omit<Planta, 'created_at' | 'usuari' | 'favorite' | 'ubicacio'> & {
  latitud: number;
  longitud: number;
};

@Component({
  selector: 'app-float-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatButtonModule,
    RouterLink,
    FormField,
  ],
  templateUrl: './app-planta-edit.html',
  styleUrl: './app-planta-edit.scss',
  standalone: true
})
export class AppFloatForm implements OnInit {
  private supaservice = inject(Supaservice);
  id = input.required<string>();
  private planta = signal<Planta | null>(null);
  sortirEvent = output<void>();

  ngOnInit(): void {
    this.supaservice.getFindByIdSupabase('plantes', Number(this.id())).then((data) => {
      if (data && data.length > 0) {
        this.planta.set(data[0] as Planta);
      }
    });
  }

  formModel = linkedSignal<PlantaEdit>(() => {
    return {
      id: this.planta()?.id ?? 0,
      nom: this.planta()?.nom ?? '',
      latitud: this.planta()?.ubicacio.lat ?? 0,
      longitud: this.planta()?.ubicacio.lon ?? 0,
      capacitat: this.planta()?.capacitat ?? 0,
      foto: this.planta()?.foto ?? '',
    };
  });

  profileForm = form(this.formModel, (schema) => {
    readonly(schema.id);
    required(schema.nom);
    required(schema.latitud);
    required(schema.longitud);
    required(schema.capacitat);
    min(schema.capacitat, 1);
    minLength(schema.nom, 3, { message: 'El nom ha de tenir mínim 3 caràcters' });
  });

  protected arxiuFoto = signal<File | null>(null);
  protected previsualitzacio = signal<string>('');
  protected pujant = signal(false);

  protected enSeleccionarFitxer(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const fitxer = input.files[0];
    this.arxiuFoto.set(fitxer);
    this.previsualitzacio.set(URL.createObjectURL(fitxer));
  }

  protected async actualitzar(event: Event) {
    event.preventDefault();
    if (!this.profileForm().valid()) return;

    const { id, nom, latitud, longitud, capacitat, foto } = this.formModel();

    this.pujant.set(true);

    let fotoUrl = foto;
    if (this.arxiuFoto()) {
      const result = await this.supaservice.uploadPlantaImage(this.arxiuFoto()!, nom);
      fotoUrl = result.publicUrl;
    }

    const planta: Partial<Planta> = {
      id,
      nom,
      ubicacio: { lat: latitud, lon: longitud },
      capacitat: +capacitat,
      foto: fotoUrl,
      usuari: this.supaservice.userSession()?.id,
    };

    await this.supaservice.updateSupabase('plantes', planta);
    this.pujant.set(false);
    this.sortirEvent.emit();
  }

  sortir() {
    this.sortirEvent.emit();
  }
}
