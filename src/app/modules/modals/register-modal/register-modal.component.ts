import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { registerUser } from 'src/app/models/auth';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent {
  //VALIDATIONS HAVE TO BE ADJUSTED AND COMPLETED

  registerForm;

  constructor(private modalService: NgbModal, private fb: FormBuilder,
  private authService: AuthService) {
    this.registerForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[a-zA-Z]$/)]],
      email: ['', [Validators.required, Validators.email],],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatpassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  
  openLoginModal(){
    this.closeModal();
    this.modalService.open(LoginModalComponent, { centered : true, size : 'lg' })
  }

  submitForm() {
    this.authService.register(this.registerForm.value as registerUser);
  }

}
