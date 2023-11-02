import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {

  loginError: string = "";

  loginForm = this.formBuilder.group({
    dni: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }


  login() {
    if (this.loginForm.valid) {
      const dni = this.loginForm.get("dni")?.value || "";
      const password = this.loginForm.get("password")?.value || "";

      console.log('*************', this.loginForm)

      this.authService.login(dni, password).subscribe({
        next: (userData) => {
          console.log(userData, "login")
          // actions like redirecting user to another page 
        },
        error: (errorData) => {
          console.error(errorData);
          if (typeof errorData.error === 'string') {
            // Si errorData.error es una cadena de texto, es probable que sea el mensaje de error.
            this.loginError = errorData.error;
          } else if (errorData.error && errorData.error.message) {
            // Si errorData.error.message existe, asumimos que es el mensaje de error.
            this.loginError = errorData.error.message;
          } else {
            // Si no se puede determinar el mensaje de error, mostrar un mensaje genérico.
            this.loginError = 'Hubo un error en el inicio de sesión';
          }
        },
        complete: () => {
          console.log('Login Completo')
          // this.router.navigateByUrl('/')
          this.loginForm.reset()
        }
      });

    }
    else {
      alert('error al ingresar datos')
      this.loginForm.markAllAsTouched()
    }
  }





  closeModal() {
    this.modalService.dismissAll();
  }
  openRegisterModal() {
    this.closeModal();
    this.modalService.open(RegisterModalComponent, { centered: true, size: 'lg' })
  }
}
