import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatiorsService {

  //dni
  public dniPattern: string = '^[a-zA-Z]{2,}(?: [a-zA-Z]+)*$';

  //password
  public passwordPattern: string = '^[a-zA-Z0-9]{6,}$';



  //validations control
  public isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  };
}
