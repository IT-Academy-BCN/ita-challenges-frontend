import { inject, Pipe, type PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({
  name: 'dynamicTranslate',
  pure: false, // Pipe refreshes when the language changes
  standalone: true
})
export class DynamicTranslatePipe implements PipeTransform {
  private language!: string
  private readonly translateService = inject(TranslateService)

  constructor () {
    this.language = this.translateService.currentLang

    this.translateService.onLangChange.subscribe((langChangeEvent: any) => {
      this.language = langChangeEvent.lang
    })
  }

  transform (value: any): string {
    if (typeof value !== 'object' || !(this.language in value)) {
      return ''
    }

    return value[this.language]
  }
}
