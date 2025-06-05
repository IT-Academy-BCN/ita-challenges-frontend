import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "customDate",
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  private months = ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"];
  transform(value: Date | string): string {
    const date = new Date(value);
    const day = date.getDate();
    const month = this.months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
}
