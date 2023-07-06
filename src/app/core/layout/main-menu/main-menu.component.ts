import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from './../../../modules/modals/login-modal/login-modal.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  
  constructor(private modalService: NgbModal){} 
  
  openLoginModal(){
    this.modalService.open(LoginModalComponent, { centered : true, size : 'lg' })
  }

}
