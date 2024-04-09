import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { type NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { RegisterModalComponent } from '../register-modal/register-modal.component'
import { type FormBuilder, Validators } from '@angular/forms'
import { type AuthService } from './../../../services/auth.service'
import { type Router } from '@angular/router'
import { type User } from 'src/app/models/user.model'
import { type ValidatorsService } from 'src/app/services/validators.service'

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
  loginError: string = ''

  loginForm = this.formBuilder.group({
    dni: ['', Validators.required, this.validatorsService.isValidDni],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showPassword: boolean = false;

  constructor (private readonly modalService: NgbModal,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly validatorsService: ValidatorsService,
    private readonly router: Router) { }

  public async login (): Promise<void> {
    this.loginForm.markAllAsTouched()
    if (this.loginForm.valid) {
      const user: User = {
        idUser: '',
        dni: `${this.loginForm.get('dni')?.value}`,
        password: `${this.loginForm.get('password')?.value}`
      }

      try {
        const res = await this.authService.login(user)
        this.openSuccessfulLoginModal(res)
      } catch (err) {
        this.notifyErrorLogin(err)
      }
    }
  };

  public isValidField (field: string) {
    return this.validatorsService.isValidInput(field, this.loginForm)
  };

  public openSuccessfulLoginModal (res: any) {
    this.closeModal()
    // TODO create routing to the page after success login
    alert('Success login')
  }

  public notifyErrorLogin (err: any) {
    if ((typeof err.error.message) === 'string') {
      this.loginError = err.error.message
    } else {
      this.loginError = 'Error en el login'
    }
  }

  closeModal () {
    this.modalService.dismissAll()
  }

  openRegisterModal () {
    this.closeModal()
    this.modalService.open(RegisterModalComponent, { centered: true, size: 'lg' })
  }

  isValidInput (input: string): boolean | null {
    return this.validatorsService.isValidInput(input, this.loginForm)
  }

  getInputError (field: string): string {
    return this.validatorsService.getInputError(field, this.loginForm)
  }

  togglePasswordMode(): void {
    this.showPassword = !this.showPassword;
  }
}
