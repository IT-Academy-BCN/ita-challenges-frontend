import { FormControl } from '@angular/forms'
import { checkBoxChecked } from './form-validator.helper'

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
