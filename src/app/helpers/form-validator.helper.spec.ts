import { FormControl } from '@angular/forms'
import { isValidDni, isValidPassword, checkBoxChecked } from './form-validator.helper'

describe('Form Validators Helper', () => {
  describe('isValidDni', () => {
    it('should return null for a valid DNI', (done) => {
      const validDniControl = new FormControl('12345678Z')
      isValidDni(validDniControl).subscribe(value => {
        console.log('Received value for valid DNI:', value)
        expect(value).toBeNull()
        done()
      })
    })

    it('should return an error object for an invalid DNI', (done) => {
      const invalidDniControl = new FormControl('12345678')
      isValidDni(invalidDniControl).subscribe(value => {
        console.log('Received value for invalid DNI:', value)
        expect(value).toEqual({ isValidDni: false })
        done()
      })
    })
  })

  describe('isValidPassword', () => {
    it('should return null for a valid password', (done) => {
      const validPasswordControl = new FormControl('Valid123')
      isValidPassword(validPasswordControl).subscribe(value => {
        console.log('Received value for valid password:', value)
        expect(value).toBeNull()
        done()
      })
    })

    it('should return an error object for an invalid password', (done) => {
      const invalidPasswordControl = new FormControl('invalid')
      isValidPassword(invalidPasswordControl).subscribe(value => {
        console.log('Received value for invalid password:', value)
        expect(value).toEqual({ invalidPassword: true })
        done()
      })
    })
  })

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
