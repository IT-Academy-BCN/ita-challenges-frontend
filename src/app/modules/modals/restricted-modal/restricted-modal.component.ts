import { Component } from '@angular/core';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restricted-modal',
  templateUrl: './restricted-modal.component.html',
  styleUrls: ['./restricted-modal.component.scss']
})
export class RestrictedModalComponent {
  constructor(private modalService: NgbModal,  private router: Router) {}

  closeModal() {
    this.modalService.dismissAll();
    // this.router.navigateByUrl('/');) 
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