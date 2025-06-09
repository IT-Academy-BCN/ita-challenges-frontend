import { Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({
  name: "customDate",
  standalone: true,
  pure: false
})
export class CustomDatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: Date | string): string {
    const lang = this.translate.currentLang || 'es'
    const date = new Date(value)

    const monthNames: Record<string, string[]> = {
      es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      ca: ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des']
    }

    const day = date.getDate()
    const month = monthNames[lang]?.[date.getMonth()] ?? monthNames['es'][date.getMonth()]
    const year = date.getFullYear()

    return lang === 'en'
      ? `${month} ${day}, ${year}`
      : `${day} ${month} ${year}`
  }
}
