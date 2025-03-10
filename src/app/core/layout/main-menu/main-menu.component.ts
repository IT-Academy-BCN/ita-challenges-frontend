import { Component, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {
  private readonly translate = inject(TranslateService)
  constructor () {
    this.translate.addLangs(['en', 'es', 'ca'])
    this.translate.setDefaultLang('ca')
    this.translate.use('ca')
  }

  changeLanguage (language: string): void {
    this.translate.use(language)
  }
}
