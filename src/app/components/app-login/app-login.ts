import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { Supaservice } from '../../services/supaservice';
import { MatButtonModule } from '@angular/material/button';
import { FormErrorsService } from '../../services/form-errors-service';

@Component({
  selector: 'app-login',
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
  templateUrl: './app-login.html',
  styleUrl: './app-login.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLogin {
  private supaservice: Supaservice = inject(Supaservice);
  private errorService: FormErrorsService = inject(FormErrorsService);

  // S'HA DE FER EN FORMULARI REACTIU
  protected readonly value = signal('');
  protected loginForm: FormGroup;

  protected errorFormMessage = signal('');

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.crearFormulario();
  }

  crearFormulario() {
    return this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  //NOTE QUAN ES FAÇA LOGIN REDIRECCIONAR A ALTRA PÀGINA AMB AÇÒ this.router.navigate(['/plantes', id]);

  public getFormErrorsToMissatge(input: string): Array<string> | null {
    if (!this.loginForm.get(input) || !this.loginForm.get(input)?.touched) return null;
    let errors = this.loginForm.get(input)?.errors || {};
    return this.errorService.arrayErrorsToMissatges(errors);
  }
  //   demo_user@demo.demo
  async login(): Promise<void> {
    this.errorFormMessage.set('');

    try {
      if (this.loginForm.invalid) {
        throw new Error('Invàlid');
      }

      let { email, password } = this.loginForm.value;

      if (!email || !password) {
        throw new Error('Algun camp buit');
      }
      await this.supaservice.login(email, password);
      this.router.navigate(['/plantes']);
    } catch (e: any) {
      let string: string = this.errorService.missatgeError(e.code);
      this.errorFormMessage.set(string || 'Error');
    }
  }

  get emailNotValid(): boolean {
    if (this.loginForm.controls['email']!.invalid && this.loginForm.get('email')!.touched) {
      return true;
    } else return false;
  }

  get emailValid(): boolean {
    return this.loginForm.get('email')!.valid && this.loginForm.get('email')!.touched;
  }

  get emailValidation(): string {
    if (this.emailNotValid) {
      return 'ts-valid';
    } else return '0';
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}


// this.formulari.value --> objecte camp/valor amb el formulari
