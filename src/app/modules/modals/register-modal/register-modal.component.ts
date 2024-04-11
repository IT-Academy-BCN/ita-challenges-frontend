import { type User } from './../../../models/user.model'

import { Component, inject, type OnInit } from '@angular/core'
import { LoginModalComponent } from '../login-modal/login-modal.component'
import { FormBuilder, Validators } from '@angular/forms'
import { type Itinerary } from 'src/app/models/itinerary.interface'
import { PostRegisterModalComponent } from '../post-register-modal/post-register-modal.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { AuthService } from 'src/app/services/auth.service'
import { ChallengeService } from 'src/app/services/challenge.service'
import { ValidatorsService } from 'src/app/services/validators.service'

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent implements OnInit {
  private readonly modalService = inject(NgbModal)
  private readonly formBuilder = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly validatorsService = inject(ValidatorsService)
  private readonly translate = inject(TranslateService)
  private readonly challengeService = inject(ChallengeService)

  registerError: string = ''
  itineraries: Itinerary[] = []

  registerForm = this.formBuilder.group({
    dni: ['', Validators.required, this.validatorsService.isValidDni],
    email: ['', [Validators.required, Validators.pattern(this.validatorsService.emailPattern)]],
    name: ['', Validators.required],
    itineraryId: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)], this.validatorsService.isValidPassword],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    legalTermsAccepted: [false, Validators.required, this.validatorsService.checkBoxChecked]
  }, {
    validators: [
      this.validatorsService.isSamePassword('password', 'confirmPassword')
    ]
  })

  showPassword: boolean = false

  constructor () {
  }

  async ngOnInit (): Promise<void> {
    await this.getItineraries()
    this.registerForm.markAsUntouched()
  }

  isValidInput (input: string): boolean | null {
    return this.validatorsService.isValidInput(input, this.registerForm)
  }

  getInputError (field: string): string {
    return this.validatorsService.getInputError(field, this.registerForm)
  }

  register (): void {
    this.registerError = ''
    this.registerForm.markAllAsTouched()
    if (this.registerForm.valid) {
      const user: User = {
        idUser: '',
        dni: `${this.registerForm.get('dni')?.value}`,
        email: `${this.registerForm.get('email')?.value}`,
        name: `${this.registerForm.get('name')?.value}`,
        itineraryId: `${this.registerForm.get('itineraryId')?.value}`,
        password: `${this.registerForm.get('password')?.value}`,
        confirmPassword: `${this.registerForm.get('confirmPassword')?.value}`
      }
      this.authService.register(user)
        .then((res) => { this.openSuccessfulRegisterModal() })
        .catch((err) => { this.notifyErrorRegister(err) })
    }
  }

  openSuccessfulRegisterModal (): void {
    this.closeModal()
    this.modalService.open(PostRegisterModalComponent, {
      backdrop: 'static',
      centered: true,
      size: 'lg'
    })
  }

  notifyErrorRegister (err: any): void {
    // this.registerError = this.translate.instant('modules.modals.register.errorMsg')
    if (err instanceof Error) {
      this.registerError = err.message
    } else {
      this.registerError = this.translate.instant('modules.modals.register.errorMsg')
    }
  }

  closeModal (): void {
    this.modalService.dismissAll()
  }

  openLoginModal (): void {
    this.closeModal()
    this.modalService.open(LoginModalComponent, {
      centered: true,
      size: 'lg'
    })
  }

  async getItineraries (): Promise<void> {
    this.itineraries = await this.challengeService.getItineraries()
  }

  togglePasswordMode (): void {
    this.showPassword = !this.showPassword
  }
}
