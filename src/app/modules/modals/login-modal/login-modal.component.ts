import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from "src/app/models/user.model";
import { ValidatorsService } from 'src/app/services/validators.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {

  loginError: string = "";

  loginForm = this.formBuilder.group({
    dni: ['', Validators.required, this.validatorsService.isValidDni],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showPassword: boolean = false;

  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private router: Router,
    private translate: TranslateService) { }

  public async login(): Promise<void> {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      let user: User = {
        idUser: '',
        dni: `${this.loginForm.get('dni')?.value}`,
        password: `${this.loginForm.get('password')?.value}`,
      }

      try {
        let res = await this.authService.login(user);
        this.openSuccessfulLoginModal(res);
      } catch (err) {
        this.notifyErrorLogin(err);
      }
    }
  };

  public isValidField(field: string) {
    return this.validatorsService.isValidInput(field, this.loginForm);
  };

  public openSuccessfulLoginModal(res: any) {
    this.closeModal();
    //TODO create routing to the page after success login
    alert('Success login');
  }

  public notifyErrorLogin(err: any) {
    if (err.status === environment.HTTP_CODE_UNAUTHORIZED || err.status === environment.HTTP_CODE_BAD_REQUEST) {
      this.loginError = this.translate.instant('modules.modals.login.invalidInput');
    } else if (err.status === environment.HTTP_CODE_FORBIDDEN) {
      this.loginError = this.translate.instant('modules.modals.login.notActive');
    } else {
      this.loginError = this.translate.instant('modules.modals.login.generalError');
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  openRegisterModal() {
    this.closeModal();
    this.modalService.open(RegisterModalComponent, { centered: true, size: 'lg' })
  }

  isValidInput(input: string): boolean | null {
    return this.validatorsService.isValidInput(input, this.loginForm);
  }

  getInputError(field: string): string {
    return this.validatorsService.getInputError(field, this.loginForm);
  }

  togglePasswordMode(): void {
    this.showPassword = !this.showPassword;
  }
}
