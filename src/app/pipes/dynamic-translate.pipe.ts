import { inject, Pipe, type PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
// import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'dynamicTranslate',
  pure: false,
  standalone: true
})
export class DynamicTranslatePipe implements PipeTransform {
  private language: string
  private readonly DEFAULT_LANGUAGE = 'ES'
  private readonly translateService = inject(TranslateService)
  // private readonly sanitizer = inject(DomSanitizer)

  constructor () {
    this.language = this.sanitizeLang(this.translateService.currentLang)

    this.translateService.onLangChange.subscribe((langChangeEvent: any) => {
      this.language = this.sanitizeLang(langChangeEvent?.lang)
    })
  }

  private sanitizeLang (lang: any): string {
    return (typeof lang === 'string' && lang.trim() !== '') ? lang.toUpperCase() : this.DEFAULT_LANGUAGE
  }

  transform (value: any): string {
    if (value === null) {
      return ''
    }

    if (typeof value === 'object' && this.language in value) {
      return value[this.language]
    }

    if (typeof value === 'string') {
      return this.tryParseJSON(value)
    }

    return ''
  }

  private tryParseJSON (value: string): string {
    const trimmedValue = value.trim()

    // Será un string no JSON
    if (!trimmedValue.startsWith('{') || !trimmedValue.endsWith('}')) {
      return trimmedValue
    }

    try {
      const parsedValue: Record<string, unknown> = JSON.parse(trimmedValue)
      const normalizedParsedValue = Object.fromEntries(
        Object.entries(parsedValue)
          .filter(([, v]) => typeof v === 'string')
          .map(([key, v]) => [key.toUpperCase(), v as string])
      )

      return normalizedParsedValue[this.language] ?? trimmedValue
    } catch {
      return trimmedValue
    }
  }
}
