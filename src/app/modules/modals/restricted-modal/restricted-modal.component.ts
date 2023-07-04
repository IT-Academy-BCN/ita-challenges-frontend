import { Component } from '@angular/core';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-restricted-modal',
  templateUrl: './restricted-modal.component.html',
  styleUrls: ['./restricted-modal.component.scss']
})
export class RestrictedModalComponent {
  constructor(private modalService: NgbModal) {}

  closeModal() {
    this.modalService.dismissAll();
  }
  
  openLoginModal(){
    this.closeModal();
    this.modalService.open(LoginModalComponent, { centered : true, size : 'lg' })
  }

  openRegisterModal(){
    this.closeModal();
    this.modalService.open(RegisterModalComponent, { centered : true, size : 'lg' })
  }
}
