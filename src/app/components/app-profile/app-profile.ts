import { Usuari } from './../../interfaces/user';
import { Component, computed, inject, linkedSignal, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { Supaservice } from '../../services/supaservice';
import {
  debounce,
  email,
  form,
  FormField,
  max,
  minLength,
  pattern,
  readonly,
  required,
  validate,
} from '@angular/forms/signals';

type UsuariProfile = Required<Usuari> & { repassword: string };

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCard,
    MatCardTitle,
    MatButtonModule,
    RouterLink,
    FormField,
  ],
  templateUrl: './app-profile.html',
  styleUrl: './app-profile.scss',
  standalone: true,
})
export class AppProfile {
  private supaservice = inject(Supaservice);
  private router = inject(Router);
  protected readonly value = signal('');
  //protected profileForm1: FormGroup;
  public user: Signal<Usuari>;
  public sessio: Signal<any>;
  //public profileForm: ReturnType<typeof form> | undefined;
  // public userData = signal<Usuari | null>(null);

  //TODO SABER SI EL SIGNAL DEL SERVEI ES CANVIA AL CANVIAR LA INFO DEL FORMULARI
  formModel = linkedSignal<UsuariProfile>(() => {
    return {
      email: this.user()?.email ?? '',
      password: '',
      repassword: '',
      username: this.user()?.username ?? '',
      fullname: this.user()?.fullname ?? '',
      phone: this.user()?.phone ?? '',
    };
  });

  profileForm = form(this.formModel, (schema) => {
    required(schema.email);
    readonly(schema.email);
    email(schema.email);
    debounce(schema.email, 500);
    minLength(schema.password, 8, { message: 'Nombre menor del mínim' });
    minLength(schema.repassword, 8, { message: 'Nombre menor del mínim' });
    minLength(schema.username, 3, { message: 'Nombre menor del mínim' });
    minLength(schema.fullname, 3, { message: 'Nombre menor del mínim' });
    minLength(schema.phone, 9, { message: 'Nombre menor del mínim' });
    pattern(schema.phone, /^\d{9}$/, { message: 'Format de telèfon invàlid' });
    pattern(schema.username, /^[^\s]+$/, {
      message: "Format de nom d'usuari invàlid: no pot tenir espais en blanc",
    });
    validate(schema.repassword, (value) => {
      return value.value() === this.formModel().password? null: { kind: 'passwordMismatch', message: "Els passwords han de coincidir"}
    })
    // TODO QUE ESCRIGA COM A MÀXIM 12 CARACTERS
  });

  constructor() {
    this.sessio = this.supaservice.getUserSession();
    this.user = computed(() => this.sessio().user_metadata);

    //this.actualitzarProfile();

    // effect(() => {
    //   const user = this.userData();
    //   console.log('[Effect] userData cambió a:', user);

    //   if (user) {
    //     console.log('[Effect] Actualizando formModel con:', user);
    //     this.formModel.set({
    //       email: user.email ?? '',
    //       password: user.password ?? '',
    //       username: user.username ?? '',
    //       fullname: user.fullname ?? '',
    //       phone: user.phone ?? '',
    //     });
    //     console.log('[Effect] formModel actualizado:', this.formModel());
    //   }
    // });
  }

  // private actualitzarProfile() {
  //   this.supaservice.getUserDataObserver()
  //     // .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe( (data) =>
  //       {
  //       // next: (data) => {
  //         if (data) {
  //           this.userData.set(data);
  //         }

  //     });
  // }

  protected async actualitzar(event: Event) {
    event.preventDefault();
    const { repassword,password, ...metadata } = this.formModel();

    const user: Usuari = {
      password: password.length === 0 ? this.user().password: password,
      email: metadata.email,
      username: metadata.username,
      fullname: metadata.fullname,
      phone: metadata.phone,
    };

    if (this.profileForm().valid()) {
      await this.supaservice.updateUser(user);
      this.router.navigate(['/plantes']);
      return;
    }

    console.log('No actualitzat');
  }

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
}

//TODO FER EL FORMULARI DE PERFIL
