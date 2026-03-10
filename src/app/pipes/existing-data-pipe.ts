import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'existingData',
  standalone: true
})
export class ExistingDataPipe implements PipeTransform {

  transform(value: any): string {
    if (value === null || value === undefined || value.toString().length === 0) return 'No';
    else return 'Si';
  }

}
