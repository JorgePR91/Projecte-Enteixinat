import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Input,
  signal,
  viewChild,
} from '@angular/core';
import { Planta } from '../../../interfaces/planta';
import { Supaservice } from '../../../services/supaservice';
import { MatCardModule } from '@angular/material/card';
import { Registre } from '../../../interfaces/registre';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { RegistreDemo } from '../../../services/registres-demo';
import { RoundPipe } from '../../../pipes/round-pipe';

Chart.register(...registerables);
type RegistreDetall = Omit<Registre, 'planta'>;

@Component({
  selector: 'app-planta-detall',
  imports: [MatCardModule, UpperCasePipe, DatePipe, MatTableModule, RoundPipe],
  templateUrl: './app-planta-detall.html',
  styleUrl: './app-planta-detall.scss',
  standalone: true,
})
export class AppPlantaDetall {
  @Input('id') plantaID?: number;
  private supaservice = inject(Supaservice);
  protected registreservice = inject(RegistreDemo);
  planta = signal<Planta | null>(null);
  usuari = computed(() => {
    const usr = this.supaservice.getUserSession();
    return usr().email;
  });
  registres = signal<Registre[]>([]);
  camps = ['id', 'created_at', 'planta', 'generacio', 'consum'];
  pagina = signal(0);
  pageSize = 5;
  registresPagina = computed(() =>
    this.registres().slice(this.pagina() * this.pageSize, (this.pagina() + 1) * this.pageSize),
  );
  totalPagines = computed(() => Math.ceil(this.registres().length / this.pageSize));

  canvas = viewChild<ElementRef>('chart');
  chart?: Chart;

  private readonly MAX_REGISTRES = 50;

  constructor() {
    effect(() => {
      const nous = this.supaservice.ultimsRegistres().filter((r) => r.planta === this.plantaID);
      if (nous.length === 0) return;
      this.registres.update((actuals) => [...actuals, ...nous].slice(-this.MAX_REGISTRES));
    });

    effect(() => {
      const registres = this.registres();
      const canvasEl = this.canvas()?.nativeElement;

      if (!canvasEl) return;

      this.chart?.destroy();

      this.chart = new Chart(canvasEl, {
        type: 'line',
        data: {
          labels: registres.map((r) => new Date(r.created_at).toLocaleTimeString()),
          datasets: [
            {
              label: 'Generació (kW)',
              data: registres.map((r) => r.generacio),
              borderColor: 'rgb(255, 165, 0)',
              backgroundColor: 'rgba(255, 166, 0, 0)',
              tension: 0.3,
              fill: true,
            },
            {
              label: 'Consum (kW)',
              data: registres.map((r) => r.consum),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              title: { display: true, text: 'Hora' },
              grid: { display: true },
            },
            y: {
              title: { display: true, text: 'kW' },
              grid: { display: true },
              beginAtZero: true,
            },
          },
          plugins: {
            legend: { display: true },
          },
        },
      });
    });
  }

  async ngOnInit() {
    if (this.plantaID) {
      const planta = await this.supaservice.getFindByIdSupabase('plantes', this.plantaID);
      this.planta.set(Array.isArray(planta) ? planta[0] : null);
      const registres = await this.supaservice.getUltimesRegistresByPlanta(this.plantaID);
      this.registres.set(registres);
    }
  }

  anteriorPagina() {
    this.pagina.update((p) => p - 1);
  }

  seguentPagina() {
    this.pagina.update((p) => p + 1);
  }

  getImageUrl(): string {
    return (
      this.planta()?.foto ||
      `https://placehold.co/300x300/orange/white?text=${encodeURIComponent(this.planta()?.nom ?? '')}`
    );
  }
}
