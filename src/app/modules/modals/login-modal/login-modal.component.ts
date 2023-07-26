import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { loginUser } from 'src/app/models/auth';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
  //VALIDATIONS HAVE TO BE ADJUSTED AND COMPLETED

  loginForm;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.nonNullable.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[a-zA-Z]$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    }); 
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  openRegisterModal(){
    this.closeModal();
    this.modalService.open(RegisterModalComponent, { centered : true, size : 'lg' })
  }
  submitForm() {
    this.authService.login(this.loginForm.value as loginUser);
  }
}
