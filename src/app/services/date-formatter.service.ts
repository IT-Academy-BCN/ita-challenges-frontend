import { Injectable, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { formatDate, registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es'
import localeCa from '@angular/common/locales/ca'
import localeEn from '@angular/common/locales/en'

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {
  private readonly translate = inject(TranslateService)

  constructor () {
    registerLocaleData(localeEs, 'es')
    registerLocaleData(localeCa, 'ca')
    registerLocaleData(localeEn, 'en')
  }

  format (date: Date, pattern: string = 'dd MMMM yyyy'): string {
    const localeId = this.getLocaleId(this.translate.currentLang)
    // Selecciona un patrón de formato basado en el idioma actual
    const formatPattern = this.getFormatPattern(this.translate.currentLang, pattern)
    return formatDate(date, formatPattern, localeId)
  }

  private getLocaleId (lang: string): string {
    switch (lang) {
      case 'es': return 'es-ES'
      case 'ca': return 'ca-ES'
      case 'en': return 'en-US'
      default: return 'en-US'
    }
  }

  // Selecciona el patrón de formato basado en el idioma
  private getFormatPattern (lang: string, defaultPattern: string): string {
    if (lang === 'en') {
      // Patrón de formato para inglés
      return 'MMMM dd, yyyy'
    }
    // Retorna el patrón por defecto para los demás idiomas
    return defaultPattern
  }
}
