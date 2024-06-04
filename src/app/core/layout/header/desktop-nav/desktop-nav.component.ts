import { Component, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { LoginModalComponent } from './../../../../modules/modals/login-modal/login-modal.component'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrl: './desktop-nav.component.scss'
})
export class DesktopNavComponent {
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

  changeLanguage (event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    const language = selectElement.value
    this.translate.use(language)
  }
}
