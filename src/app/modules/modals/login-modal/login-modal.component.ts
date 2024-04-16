import { Component, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { RegisterModalComponent } from '../register-modal/register-modal.component'
import { FormBuilder, Validators } from '@angular/forms'
import { AuthService } from './../../../services/auth.service'
import { Router } from '@angular/router'
import { type User } from 'src/app/models/user.model'
import { ValidatorsService } from 'src/app/services/validators.service'
import { environment } from 'src/environments/environment'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
  private readonly modalService = inject(NgbModal)
  private readonly formBuilder = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly validatorsService = inject(ValidatorsService)
  private readonly router = inject(Router)
  private readonly translate = inject(TranslateService)

  loginError: string = ''

  loginForm = this.formBuilder.group({
    dni: ['', Validators.required, this.validatorsService.isValidDni],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  showPassword: boolean = false

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

  public isValidField (field: string): boolean {
    return this.validatorsService.isValidInput(field, this.loginForm)
  };

  public openSuccessfulLoginModal (res: any): void {
    this.closeModal()
    // TODO create routing to the page after success login
    alert('Success login')
  }

  public notifyErrorLogin (err: any): void {
    switch (err.status) {
      case environment.HTTP_CODE_UNAUTHORIZED:
        this.loginError = this.translate.instant('modules.modals.login.invalidInput')
        break
      case environment.HTTP_CODE_BAD_REQUEST:
        this.loginError = this.translate.instant('modules.modals.login.invalidInput')
        break
      case environment.HTTP_CODE_FORBIDDEN:
        this.loginError = this.translate.instant('modules.modals.login.notActive')
        break
      default:
        this.loginForm = this.translate.instant('modules.modals.login.generalError')
    }
  }

  closeModal (): void {
    this.modalService.dismissAll()
  }

  openRegisterModal (): void {
    this.closeModal()
    this.modalService.open(RegisterModalComponent, { centered: true, size: 'lg' })
  }

  isValidInput (input: string): boolean | null {
    return this.validatorsService.isValidInput(input, this.loginForm)
  }

  getInputError (field: string): string {
    return this.validatorsService.getInputError(field, this.loginForm)
  }

  togglePasswordMode (): void {
    this.showPassword = !this.showPassword
  }
}
