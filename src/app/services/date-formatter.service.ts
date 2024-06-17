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

  format (date: Date, pattern: string = 'dd MMM yyyy'): string {
    if (date === null || date === undefined) {
      console.error('DateFormatterService.format: La fecha es indefinida o inválida')
      return '' // Retorna un string vacío si la fecha no es válida.
    }
    const localeId = this.getLocaleId(this.translate.currentLang)
    const formatPattern = this.getFormatPattern(this.translate.currentLang, pattern)
    let formattedDate = formatDate(date, formatPattern, localeId)

    // Ajuste manual para asegurar que el mes esté en el formato correcto.
    const parts = formattedDate.split(' ')
    if (this.translate.currentLang === 'en' && parts.length === 3) {
    // Reordena para inglés a "MMM dd, yyyy".
      formattedDate = `${parts[0]} ${parts[1]} ${parts[2]}`
    } else if (parts.length >= 3) {
      let monthIndex = 1 // Índice del mes en el arreglo.
      if (this.translate.currentLang === 'ca' && parts[1] === 'de') {
      // Ajuste específico para catalán, donde el formato incluye 'de'.
        monthIndex = 2 // El mes está en la tercera posición para catalán.
      }
      const month = parts[monthIndex]
      // Asegura que la primera letra esté en mayúscula y el resto en minúsculas.
      parts[monthIndex] = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()

      if (this.translate.currentLang === 'ca' && parts[1] === 'de') {
      // Para catalán, asegura que el mes siempre esté presente incluso después de ajustar.
      // No remueve 'de' para mantener la consistencia con el formato original.
      } else if (this.translate.currentLang === 'ca') {
      // Si se requiere otro ajuste para catalán que no involucre 'de'.
      }
      formattedDate = parts.join(' ')
    }

    return formattedDate
  }

  private getLocaleId (lang: string): string {
    switch (lang) {
      case 'es': return 'es-ES'
      case 'ca': return 'ca-ES'
      case 'en': return 'en-US'
      default: return 'ca-ES'
    }
  }

  // Selecciona el patrón de formato basado en el idioma.
  private getFormatPattern (lang: string, defaultPattern: string): string {
    switch (lang) {
      case 'en':
        // Patrón de formato para inglés ajustado.
        return 'MMM dd, yyyy'
      case 'es':
      case 'ca':
        // Patrón de formato para español y catalán, ajustado para coincidir con Figma.
        return 'dd MMM yyyy'
      default:
        // Retorna el patrón por defecto para los demás idiomas.
        return defaultPattern
    }
  }
}
