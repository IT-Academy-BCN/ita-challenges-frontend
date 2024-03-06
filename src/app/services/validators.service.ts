import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  //email
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  
    //checks if flied is valid and touched
    isValidInput(input: string, form: FormGroup): boolean | null {
      return form.controls[input].errors && form.controls[input].touched;
    }
  
    //returns a message error 
    getInputError(input: string, form: FormGroup): string {
      let errors = form.controls[input].errors || {};
      let errorMessage: string = ""
  
      for (let error of Object.keys(errors)) {
        switch (error) {
          case 'required':
            errorMessage = "Campo obligatorio";
            break;
          case 'email':
            errorMessage = 'Email Erróneo';
            break;
          case 'minlength':
            errorMessage = `Mínimo ${errors['minlength']['requiredLength']} carácteres`;
            break;
          case 'isValidDni':
            errorMessage = `DNI inválido`;
            break;
          case 'notSamePassword':
            errorMessage = `Las contraseñas no coinciden`;
            break;
          case 'notChecked':
            errorMessage = `Casilla obligatoria`;
            break;
          case 'invalidPassword':
            errorMessage = `Mínimo 1 mayúscula, 1 minúscula, 1 número y sin caracteres especiales`;
            break;
          case 'pattern':
            errorMessage = `Format0 incorrecto`;
            break;
          
        }
      }
      return errorMessage;
    }
  
    public isValidDni(control: AbstractControl): Observable<ValidationErrors | null> {
      let dni: string = control.value;
      let dniRegex = /^[0-9]{8}[A-Za-z]$/;
  
      if (!dniRegex.test(dni)) {
        of({ isValidDni: false });
      }
  
      let numDni = dni.substring(0, 8);
      let controlLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
      let expectedLetterIndex = parseInt(numDni) % 23;
      let expectedLetter = controlLetters.charAt(expectedLetterIndex);
  
      if (dni.charAt(8).toUpperCase() === expectedLetter) {
        return of(null);
      }
  
      return of({ isValidDni: false });
    }
  
    public isSamePassword(password: string, confirmPassword: string) {
      return (formGroup: AbstractControl): ValidationErrors | null => {
        const passwordValue = formGroup.get(password)?.value;
        const confirmValue = formGroup.get(confirmPassword)?.value;
  
        if (passwordValue !== confirmValue) {
          formGroup.get(confirmPassword)?.setErrors({ notSamePassword: true });
          return { notSamePassword: true }
        }
        formGroup.get(confirmPassword)?.setErrors(null);
        return null;
      };
    }
  
    public checkBoxChecked(control: AbstractControl): Observable<ValidationErrors | null>{
      if(control.value === true){
        return of(null)
      }
      return of({notChecked: true});
    }

    isValidPassword(control: AbstractControl): Observable<ValidationErrors | null>{
      let password: string = control.value;
      let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]+$/;
  
      if (passwordRegex.test(password)) {
        return of(null);
      }

      return of({ invalidPassword: true });
    }

}