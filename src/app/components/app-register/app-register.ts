import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { Supaservice } from '../../services/supaservice';
import { FormErrorsService } from '../../services/form-errors-service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCard,
    MatCardTitle,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './app-register.html',
  styleUrl: './app-register.scss',
  standalone: true,
})
export class AppRegister {
  private supaservice: Supaservice = inject(Supaservice);
  private errorService: FormErrorsService = inject(FormErrorsService);

  protected readonly value = signal('');
  protected registerForm: FormGroup;

  protected errorFormMessage = signal('');
  protected errorEmailMessage = signal<string[]>([]);
  protected errorPwdMessage = signal<string[]>([]);
  protected errorRepwdMessage = signal<string[]>([]);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.registerForm = this.crearFormulario();
  }

  crearFormulario() {
    return this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZñÑ0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  public getFormErrorsToMissatge(input: string): Array<string> | null {
    if (!this.registerForm.get(input) || !this.registerForm.get(input)?.touched) return null;
    let errors = this.registerForm.get(input)?.errors || {};
    return this.errorService.arrayErrorsToMissatges(errors);
  }

  //TODO VALIDAR SI ELS CORREUS SÓN IGUALS
  //TODO PLANTILLA DE VALIDACIÓ D'INPUTS
  // email: "demo_user@demo.dem" password: "sfsfef34f"
  async register(): Promise<void> {
    this.errorFormMessage.set('');

    try {
      if (this.registerForm.invalid) {
        throw new Error('Invàlid');
      }

      let { email, password, repassword } = this.registerForm.value;

      if (!email || !password) {
        throw new Error('Algun camp buit');
      } else if (password !== repassword) {
        //this.errorEmailMessage.set('no coincideixen');
        throw new Error('Les contrasenyes aportades no coincideixen');
      }

      await this.supaservice.register(email, password);
      console.log('Usuari Registrat');
      this.router.navigate(['/plantes']);
    } catch (e: any) {
      this.errorFormMessage.set(e.message || 'Error');
    }
  }

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
}

/**
 * 2. Autenticación de usuarios: Los usuarios gestionados por Supabase Auth (tabla interna auth.users) no se pueden eliminar directamente con SQL. Debes usar la API de Supabase o el panel de administración para borrar usuarios. Ejemplo con la API de Admin:
 *
 * const { data, error } = await supabase.auth.admin.deleteUser('user_id');
 *
 */
