
import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginModalComponent } from "../login-modal/login-modal.component";
import { Validators, FormBuilder } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/user.model";

@Component({
	selector: "app-register-modal",
	templateUrl: "./register-modal.component.html",
	styleUrls: ["./register-modal.component.scss"],
})
export class RegisterModalComponent {
	registerError: string = "";

	registerForm = this.formBuilder.group({
		dni: ["", Validators.required],
		email: ["", Validators.required],
		password: ["", Validators.required],
		repeatpassword: ["", Validators.required],
	});

	constructor(
		private modalService: NgbModal,
		private formBuilder: FormBuilder,
		private authService: AuthService
	) {}

	register() {
		console.log("Valores del formulario:", this.registerForm.value);
		if (this.registerForm.valid) {
			const user = new User(
				this.registerForm.get("dni")?.value ?? "", // Usa '' como valor predeterminado
				this.registerForm.get("email")?.value ?? "", // Usa '' como valor predeterminado
				this.registerForm.get("password")?.value ?? "",
				this.registerForm.get("repeatpassword")?.value ?? ""
			);
      console.log(user, 'from register-modal********')
			this.authService.register(user).subscribe({
				next: (userData) => {},
				error: (errorData) => {
					console.error(errorData);
					this.registerError = errorData;
				},
			});
		}
	}
	closeModal() {
		this.modalService.dismissAll();
	}

	openLoginModal() {
		this.closeModal();
		this.modalService.open(LoginModalComponent, {
			centered: true,
			size: "lg",
		});
	}
}
