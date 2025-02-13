import { inject, Pipe, type PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
  name: 'dynamicTranslate',
  pure: false,
  standalone: true
})
export class DynamicTranslatePipe implements PipeTransform {
  private language!: string
  private readonly translateService = inject(TranslateService)
  private readonly sanitizer = inject(DomSanitizer)

  constructor () {
    this.language = this.translateService.currentLang

    this.translateService.onLangChange.subscribe((langChangeEvent: any) => {
      this.language = langChangeEvent.lang
    })
  }

  transform (value: any): string {
    if (value === null) {
      return ''
    }

    // Si es un string simple, devuélvelo tal cual
    if (typeof value === 'string') {
      return value
    }

    // Si es un objeto de traducción
    if (typeof value === 'object' && this.language in value) {
      return value[this.language]
    }

    return ''
  }
}
