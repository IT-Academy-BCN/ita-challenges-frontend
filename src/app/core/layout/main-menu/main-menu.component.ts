import { Component } from '@angular/core';
<<<<<<< HEAD
import { TranslateService } from '@ngx-translate/core';
=======
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from './../../../modules/modals/register-modal/register-modal.component';
>>>>>>> c6f5bd08bad30ad02e45510fb02d248f9ba6b5f5

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
<<<<<<< HEAD
export class MainMenuComponent { 
  constructor( private translate: TranslateService) {
    translate.addLangs(['en', 'es', 'cat']);
    translate.setDefaultLang('es');
    translate.use('es');  
=======
export class MainMenuComponent {
  
  constructor(private modalService: NgbModal){} 
  
  openRegisterModal(){
    this.modalService.open(RegisterModalComponent, { centered : true, size : 'lg' })
>>>>>>> c6f5bd08bad30ad02e45510fb02d248f9ba6b5f5
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
