import { Inject, Injectable } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public selectWidth = '45px'

  constructor (
    @Inject(NgbModal) private readonly modalService: NgbModal,
    @Inject(TranslateService) private readonly translate: TranslateService
  ) {
    this.translate.addLangs(['en', 'es', 'ca'])
    this.translate.setDefaultLang('ca')
    this.translate.use('ca')
  }

  changeLanguage (language: string): void {
    this.translate.use(language)
    this.selectWidth = language === 'ca' ? '45px' : '45px'
  }
}
