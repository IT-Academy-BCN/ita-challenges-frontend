import { Component, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { LoginModalComponent } from './../../../modules/modals/login-modal/login-modal.component'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: '   app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  private readonly modalService = inject(NgbModal)
  private readonly translate = inject(TranslateService)
  constructor () {
    this.translate.addLangs(['en', 'es', 'ca'])
    this.translate.setDefaultLang('ca')
    this.translate.use('ca')
  }

  openLoginModal (): void {
    this.modalService.open(LoginModalComponent, { centered: true, size: 'lg' })
  }

  changeLanguage (language: string): void {
    this.translate.use(language)
  }
}
