import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from '../register-modal/register-modal.component';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {

  constructor(private modalService: NgbModal) {}

  closeModal() {
    this.modalService.dismissAll();
  }
  openRegisterModal(){
    this.closeModal();
    this.modalService.open(RegisterModalComponent, { centered : true, size : 'lg' })
  }
}
