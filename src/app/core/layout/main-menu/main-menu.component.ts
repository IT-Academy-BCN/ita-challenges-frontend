import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from './../../../modules/modals/register-modal/register-modal.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent { 
  constructor( private translate: TranslateService,
                private modalService: NgbModal) {
                translate.addLangs(['en', 'es', 'cat']);
                translate.setDefaultLang('es');
                translate.use('es');  
              }
  
  
  openRegisterModal(){
    this.modalService.open(RegisterModalComponent, { centered : true, size : 'lg' })
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
