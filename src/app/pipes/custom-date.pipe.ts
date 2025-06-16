import { Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({
  name: "customDate",
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  private monthNames: Record<string, string[]> = {
    es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ca: ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des']
  }

  constructor(private translate: TranslateService) {}

  transform(value: Date | string): string {
    const date = new Date(value)
    const day = date.getDate()
    const monthIndex = date.getMonth()
    const year = date.getFullYear()
    const lang = this.translate.currentLang || 'es'
    const months = this.monthNames[lang] || this.monthNames['es']

    return `${day} ${months[monthIndex]} ${year}`
  }
}
