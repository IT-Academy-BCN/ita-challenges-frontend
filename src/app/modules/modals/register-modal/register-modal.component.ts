import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent {

  registerError: string = "";
  newUser: User | undefined

  registerForm = this.formBuilder.group({
    dni: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    repeatpassword: ['', Validators.required]
  });

  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private authService: AuthService) { }


    register() {
      if (this.registerForm.valid) {
        const dni = this.registerForm.get("dni")?.value || "";
        const email = this.registerForm.get("email")?.value || "";
        const password = this.registerForm.get("password")?.value || "";
        const repeatpassword = this.registerForm.get("repeatpassword")?.value || "";
    
        this.newUser = new User(dni, email, password, repeatpassword);
    
        console.log('*************', this.newUser)
        this.authService.register(this.newUser).subscribe({
          next: (userData) => {
            console.log('from register ts file' , userData)
            // actions like redirecting user to another page 
          },
          error: (errorData) => {
            console.error(errorData);
            this.registerError = errorData;
          }
        });
      }
    }
    

  closeModal() {
    this.modalService.dismissAll();
  }

  openLoginModal() {
    this.closeModal();
    this.modalService.open(LoginModalComponent, { centered: true, size: 'lg' })
  }

}
