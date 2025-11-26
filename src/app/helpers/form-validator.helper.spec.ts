import { FormControl, FormGroup, AbstractControl } from '@angular/forms'
import { isValidPassword, isValidDni, getInputError, checkBoxChecked } from './form-validator.helper'

describe('form-validator.helper', () => {
  describe('isValidPassword', () => {
    it('returns null for a valid password', done => {
      const control = { value: 'Abcdef12' } as unknown as AbstractControl
      isValidPassword(control).subscribe(result => {
        expect(result).toBeNull()
        done()
      })
    })

    it('returns invalidCredentialFormat for an invalid password', done => {
      const control = { value: 'short' } as unknown as AbstractControl
      isValidPassword(control).subscribe(result => {
        expect(result).toEqual({ invalidCredentialFormat: true })
        done()
      })
    })
  })

  describe('isValidDni', () => {
    it('returns null for a valid DNI', done => {
      // 12345678 % 23 = 14 -> letter at index 14 is 'Z'
      const control = { value: '12345678Z' } as unknown as AbstractControl
      isValidDni(control).subscribe(result => {
        expect(result).toBeNull()
        done()
      })
    })

    it('returns isValidDni:false for an invalid DNI', done => {
      const control = { value: '12345678A' } as unknown as AbstractControl
      isValidDni(control).subscribe(result => {
        expect(result).toEqual({ isValidDni: false })
        done()
      })
    })
  })

  describe('getInputError', () => {
    it('returns the translated invalidCredentialFormat message', () => {
      const form = new FormGroup({ pwd: new FormControl('') })
      form.controls['pwd'].setErrors({ invalidCredentialFormat: true })
      const translateMock = { instant: jest.fn().mockReturnValue('Invalid credentials format') } as any

      const message = getInputError('pwd', form, translateMock)
      expect(message).toBe('Invalid credentials format')
    })

    it('returns minlength formatted message', () => {
      const form = new FormGroup({ field: new FormControl('') })
      form.controls['field'].setErrors({ minlength: { requiredLength: 5 } })
      const translateMock = { instant: jest.fn().mockReturnValue('minimum characters') } as any

      const message = getInputError('field', form, translateMock)
      expect(message).toBe('5 minimum characters')
    })
  })
})


describe('Form Validators Helper', () => {
  describe('checkBoxChecked', () => {
    it('should return null when the checkbox is checked', (done) => {
      const checkedControl = new FormControl(true)
      checkBoxChecked(checkedControl).subscribe(value => {
        console.log('Received value for checked checkbox:', value)
        expect(value).toBeNull()
        done()
      })
    })

    it('should return an error object when the checkbox is not checked', (done) => {
      const uncheckedControl = new FormControl(false)
      checkBoxChecked(uncheckedControl).subscribe(value => {
        console.log('Received value for unchecked checkbox:', value)
        expect(value).toEqual({ notChecked: true })
        done()
      })
    })
  })
})
