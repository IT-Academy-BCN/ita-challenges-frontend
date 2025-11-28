import type { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms'
import { of } from 'rxjs'
import type { Observable } from 'rxjs'
import type { TranslateService } from '@ngx-translate/core'

// checks if field is valid and touched
export function isValidInput (input: string, form: FormGroup): boolean {
  if (form.controls[input].errors !== null && form.controls[input].touched) {
    return true
  }
  return false
}

// returns a message error
export function getInputError (input: string, form: FormGroup, translate: TranslateService): string {
  const errors = form.controls[input].errors ?? {}
  let errorMessage: string = ''

  for (const error of Object.keys(errors)) {
    switch (error) {
      case 'required':
        errorMessage = translate.instant('services.validators.required')
        break
      case 'email':
        errorMessage = translate.instant('services.validators.email')
        break
      case 'minlength':
        errorMessage = `${errors['minlength'].requiredLength} ${translate.instant('services.validators.minLength')}`
        break
      case 'isValidDni':
        errorMessage = translate.instant('services.validators.isValidDni')
        break
      case 'notSamePassword':
        errorMessage = translate.instant('services.validators.notSamePassword')
        break
      case 'notChecked':
        errorMessage = translate.instant('services.validators.notChecked')
        break
      case 'invalidPassword':
        errorMessage = translate.instant('services.validators.invalidPassword')
        break
      case 'pattern':
        errorMessage = translate.instant('services.validators.pattern')
        break
    }
  }
  return errorMessage
}

export function isValidDni (control: AbstractControl): Observable<ValidationErrors | null> {
  const dni: string = control.value
  const dniRegex = /^[0-9]{8}[A-Za-z]$/

  if (!dniRegex.test(dni)) {
    return of({ isValidDni: false })
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

export function isSamePassword (password: string, confirmPassword: string) {
  return (formGroup: FormGroup): ValidationErrors | null => {
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

export function checkBoxChecked (control: AbstractControl): Observable<ValidationErrors | null> {
  if (control.value === true) {
    return of(null)
  }
  return of({ notChecked: true })
}

export function isValidPassword (control: AbstractControl): Observable<ValidationErrors | null> {
  const password: string = control.value
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

  if (passwordRegex.test(password)) {
    return of(null)
  }

  return of({ invalidPassword: true })
}
