import { Component } from '@angular/core'
import { type NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { LoginModalComponent } from './../../../modules/modals/login-modal/login-modal.component'
import { type TranslateService } from '@ngx-translate/core'

@Component({
  selector: '   app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  constructor (private readonly modalService: NgbModal,
    private readonly translate: TranslateService) {
    translate.addLangs(['en', 'es', 'cat'])
    translate.setDefaultLang('es')
    translate.use('es')
  }

  openLoginModal () {
    this.modalService.open(LoginModalComponent, { centered: true, size: 'lg' })
  }

  changeLanguage (language: string): void {
    this.translate.use(language)
  }
}
