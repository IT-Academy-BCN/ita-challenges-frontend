import { Inject, Injectable } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { LoginModalComponent } from '../modules/modals/login-modal/login-modal.component'
import { TranslateService } from '@ngx-translate/core'

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public selectWidth = '69px'

  constructor (
    @Inject(NgbModal) private readonly modalService: NgbModal,
    @Inject(TranslateService) private readonly translate: TranslateService
  ) {
    this.translate.addLangs(['en', 'es', 'ca'])
    this.translate.setDefaultLang('ca')
    this.translate.use('ca')
  }

  openLoginModal (): void {
    this.modalService.open(LoginModalComponent, { centered: true, size: 'lg' })
  }

  changeLanguage (language: string): void {
    this.translate.use(language)
    this.selectWidth = language === 'ca' ? '69px' : '57px'
  }
}
