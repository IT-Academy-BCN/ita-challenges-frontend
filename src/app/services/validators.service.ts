import { Injectable } from '@angular/core'
import { type AbstractControl, type FormGroup, type ValidationErrors } from '@angular/forms'
import { type TranslateService } from '@ngx-translate/core'
import { type Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  constructor (private readonly translate: TranslateService) {

  }

  // email
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'

  // checks if flied is valid and touched
  isValidInput (input: string, form: FormGroup): boolean | null {
    return form.controls[input].errors && form.controls[input].touched
  }

  // returns a message error
  getInputError (input: string, form: FormGroup): string {
    const errors = form.controls[input].errors ?? {}
    let errorMessage: string = ''

    for (const error of Object.keys(errors)) {
      switch (error) {
        case 'required':
          errorMessage = this.translate.instant('services.validators.required')
          break
        case 'email':
          errorMessage = this.translate.instant('services.validators.email')
          break
        case 'minlength':
          errorMessage = `${errors['minlength'].requiredLength} ${this.translate.instant('services.validators.minLength')}`
          break
        case 'isValidDni':
          errorMessage = this.translate.instant('services.validators.isValidDni')
          break
        case 'notSamePassword':
          errorMessage = this.translate.instant('services.validators.notSamePassword')
          break
        case 'notChecked':
          errorMessage = this.translate.instant('services.validators.notChecked')
          break
        case 'invalidPassword':
          errorMessage = this.translate.instant('services.validators.invalidPassword')
          break
        case 'pattern':
          errorMessage = this.translate.instant('services.validators.pattern')
          break
      }
    }
    return errorMessage
  }

  public isValidDni (control: AbstractControl): Observable<ValidationErrors | null> {
    const dni: string = control.value
    const dniRegex = /^[0-9]{8}[A-Za-z]$/

    if (!dniRegex.test(dni)) {
      of({ isValidDni: false })
    }

    const numDni = dni.substring(0, 8)
    const controlLetters = 'TRWAGMYFPDXBNJZSQVHLCKE'
    const expectedLetterIndex = parseInt(numDni) % 23
    const expectedLetter = controlLetters.charAt(expectedLetterIndex)

    if (dni.charAt(8).toUpperCase() === expectedLetter) {
      return of(null)
    }

    return of({ isValidDni: false })
  }

  public isSamePassword (password: string, confirmPassword: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordValue = formGroup.get(password)?.value
      const confirmValue = formGroup.get(confirmPassword)?.value

      if (passwordValue !== confirmValue) {
        formGroup.get(confirmPassword)?.setErrors({ notSamePassword: true })
        return { notSamePassword: true }
      }
      formGroup.get(confirmPassword)?.setErrors(null)
      return null
    }
  }

  public checkBoxChecked (control: AbstractControl): Observable<ValidationErrors | null> {
    if (control.value === true) {
      return of(null)
    }
    return of({ notChecked: true })
  }

  isValidPassword (control: AbstractControl): Observable<ValidationErrors | null> {
    const password: string = control.value
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]+$/

    if (passwordRegex.test(password)) {
      return of(null)
    }

    return of({ invalidPassword: true })
  }
}
