import { DatePipe } from '@angular/common'
import { Pipe, type PipeTransform } from '@angular/core'

@Pipe({
  name: 'formatDate',
  pure: true,
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform (date: string | Date): any {
    // todo: need to fix, need change with the lenguage selected
    const datePipe: DatePipe = new DatePipe('en-EU')
    return datePipe.transform(date, 'MMM d, y')
  }
}
