import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})

export class TimeFormatPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: string | Date): string | null {
    return this.datePipe.transform(value, 'hh:mm a');
  }

}
