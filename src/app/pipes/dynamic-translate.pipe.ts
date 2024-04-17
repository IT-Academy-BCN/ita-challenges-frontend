import { Pipe, type PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({
  name: 'dynamicTranslate',
  pure: false, // Pipe refreshes when the language changes
  standalone: true
})
export class DynamicTranslatePipe implements PipeTransform {
  private language!: string

  constructor (private readonly translateService: TranslateService) {
    this.language = this.translateService.currentLang

    this.translateService.onLangChange.subscribe((langChangeEvent: any) => {
      this.language = langChangeEvent.lang
    })
  }

  transform (value: any): string {
    if (typeof value !== 'object' || !value[this.language]) {
      return ''
    }

    return value[this.language]
  }
}
