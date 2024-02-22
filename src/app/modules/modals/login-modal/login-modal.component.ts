import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from "src/app/models/user.model";
import { ValidatorsService } from 'src/app/services/validators.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {

  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private router: Router) { }

  loginError: string = "";

  loginForm = this.formBuilder.group({
    dni: ['', Validators.required],
    password: ['', Validators.required]
  });

  public login(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      let user: User = {
        idUser: '',
        dni: `${this.loginForm.get('dni')?.value}`,
        password: `${this.loginForm.get('password')?.value}`,
      }

      let registerResp = this.authService.login(user)
			.then( (res) => {this.openSuccessfulLoginModal(res)})
			.catch( (err) => this.notifyErrorLogin(err));
    }
  };
  public isValidField(field: string) {
    return this.validatorsService.isValidInput(field, this.loginForm);
  };

  public openSuccessfulLoginModal(res: any) {
    //TODO create routing to the page after success login
    alert('Success login');
  }

  public notifyErrorLogin(err: any) {
    if ((typeof err.message) === "string") {
      this.loginError = err.message;
    } else {
      this.loginError = 'Error en el registro';
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  openRegisterModal() {
    this.closeModal();
    this.modalService.open(RegisterModalComponent, { centered: true, size: 'lg' })
  }
}
