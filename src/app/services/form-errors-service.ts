import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { FieldState, WithField } from '@angular/forms/signals';

@Injectable({
  providedIn: 'root',
})
export class FormErrorsService {
  protected missatgesError: Record<string, string> = {
    required: 'Aquest camp és necessari',
    pattern: "El format d'email no és correcte",
    email: "El format d'email no és correcte",
    minlength: 'No acompleix el mínim de caràcters',
    maxlength: 'Sobrepasses el màxim de caràcters',
    min: 'Nombre menor del mínim',
    max: 'Nombre major del màxim',
    invalid_credentials: 'Credencials invàlides',
    user_already_exists: 'Aquest usuari ja existeix',
    email_not_confirmed: 'Email no confirmat. Comprova el teu correu',
    weak_password: 'La contrasenya és massa feble',
    invalid_email: 'Email invàlid',
    over_email_send_rate_limit: 'Massa intents. Espera uns minuts...',
    user_not_found: 'Usuari no trobat',
  };

  public missatgeError(error: string): string {
    return this.missatgesError[error] || 'Error desconegut';
  }
  public arrayErrorsToMissatges(errors: Record<string, string>): Array<string> {
    let errorsArray = Object.keys(errors).map((error): string => this.missatgeError(error.toLowerCase()));
    return [...new Set(errorsArray)];
  }

  // public signalErrorsToMissatges(errors: Array<{ code: string; message: string }>): Array<string> {
  //   let errorsArray: Record<string, string> = {};
  //   errors.forEach((error) => errorsArray[error.code] = error.message);
  //   return this.arrayErrorsToMissatges(errorsArray);
  // }
}
