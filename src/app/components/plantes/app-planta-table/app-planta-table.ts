import { Component, ChangeDetectionStrategy, computed, inject, input, signal, OnInit } from '@angular/core';
import { Supaservice } from '../../../services/supaservice';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AppFloatForm } from "../app-planta-edit/app-planta-edit";
import { Planta } from '../../../interfaces/planta';
import { ExistingDataPipe } from '../../../pipes/existing-data-pipe';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Confirmar eliminació</h2>
    <mat-dialog-content>Segur que vols esborrar aquesta planta? Si té registres associats també s'eliminaran.</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel·lar</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Esborrar</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {}

@Component({
  selector: 'app-planta-table',
  imports: [MatTableModule, MatButtonModule, UpperCasePipe, AppFloatForm, RouterLink, ExistingDataPipe, DatePipe],
  templateUrl: './app-planta-table.html',
  styleUrl: './app-planta-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPlantasTable implements OnInit {
  private supaservice = inject(Supaservice);
  private dialog = inject(MatDialog);

  protected camps = signal<string[]>([]);
  protected plantas = signal<Planta[]>([]);
  protected user = this.supaservice.getUserSession();
  protected eliminarCamp = input<string[]>([]);
  protected campsbottons = computed(() => [...this.camps(), 'accions']);
  protected idEdit = signal<string>('');

  ngOnInit() {
    this.inicialitzar().catch(err => console.error('Error inicialitzant:', err));
  }

  private async inicialitzar(): Promise<void> {
    const u = this.user();
    if (!u) return;

    const columnes = await this.supaservice.columnNames('plantes');
    if (columnes) this.camps.set(columnes.filter((c) => !this.eliminarCamp().includes(c)));

    await this.actualitzarItems();
  }

  private async actualitzarItems(): Promise<void> {
    const u = this.user();
    if (!u) return;
    const data = await this.supaservice.getFindByValueStringSupabase('plantes', 'usuari', u.id);
    this.plantas.set(data ?? []);
  }

  protected plainObjecte(objecte: any) {
    return Object.entries(objecte)
      .map((v) => `${v[0]}: ${v[1]}`)
      .join(' ');
  }

  protected esObjecte(objecte: any) {
    return objecte !== null && typeof objecte === 'object';
  }

  protected editar(id: string) {
    this.idEdit.set(id);
  }

  protected async eliminar(id: number) {
    const confirmat = await lastValueFrom(this.dialog.open(ConfirmDialogComponent).afterClosed());
    if (!confirmat) return;

    await this.supaservice.deletePlantaSafe(id);
    await this.actualitzarItems();
  }

  protected async onSortir() {
    this.idEdit.set('');
    await this.actualitzarItems();
  }
}
