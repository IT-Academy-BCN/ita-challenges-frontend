import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from './../../../modules/modals/login-modal/login-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: '   app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  
  constructor(private modalService: NgbModal,
              private translate: TranslateService){
                translate.addLangs(['en', 'es', 'ca']);
                translate.setDefaultLang('ca');
                translate.use('ca'); 
              } 
  
  openLoginModal(){
    this.modalService.open(LoginModalComponent, { centered : true, size : 'lg' })
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
