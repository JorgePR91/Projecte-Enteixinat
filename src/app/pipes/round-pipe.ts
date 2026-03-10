import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundPipe',
  standalone: true
})
export class RoundPipe implements PipeTransform {

  transform(value: number, decimals: number = 2): string {
    if(value === null || isNaN(value)) return ' ';
    return `${value.toFixed(decimals)} kW`;
  }

}
