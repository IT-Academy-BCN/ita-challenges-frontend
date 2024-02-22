import { environment } from './../../../../environments/environment';
import { User } from './../../../models/user.model';

import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginModalComponent } from "../login-modal/login-modal.component";
import { Validators, FormBuilder, AbstractControl, FormGroup } from "@angular/forms";
import { AuthService } from './../../../services/auth.service';
import { ItinerariesService } from './../../../services/itineraries.service';
import { Itinerary } from 'src/app/models/itinerary.interface';

@Component({
	selector: "app-register-modal",
	templateUrl: "./register-modal.component.html",
	styleUrls: ["./register-modal.component.scss"],
})
export class RegisterModalComponent implements OnInit {
	registerError: string = "";
	itineraries: Itinerary[] = [];

	registerForm = this.formBuilder.group({
		dni: ["", Validators.required, this.isValidDni],
		email: ["", Validators.required],
		name: ["", Validators.required],
		itineraryId: ["", Validators.required],
		password: ["", Validators.required],
		confirmPassword: ["", Validators.required, this.isSamePassword],
		legalTermsAccepted: ["", Validators.required],
	});

	constructor(
		private modalService: NgbModal,
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private itinerariesService: ItinerariesService,
	) { }

	ngOnInit(): void {
		this.getItineraries();
	}


	isSamePassword(control: AbstractControl) {
		if (control.value === this.registerForm.get('password')!.value) {
			return { isSamePassword: true };
		}
		return null;
	}

	isValidDni(control: AbstractControl) {
		let dni: string = control.value;
		let dniRegExp = /^\d{8}[a-zA-Z]$/;

		if (dniRegExp.test(dni) == true) {
			let num: number = parseInt(dni.substring(0, dni.length - 1));
			let idLetter = dni.substring(dni.length - 1, 1);
			num = num % 23;
			let letter = 'TRWAGMYFPDXBNJZSQVHLCKET';
			letter = letter.substring(num, num + 1);
			if (letter != idLetter.toUpperCase()) {
				return null;
			} else {
				return { isValidDni: true };
			}
		} else {
			return null;
		}
	}

	isValidInput(input: string ): boolean | null {
		return this.isValidInputI(input, this.registerForm)
	}

	getInputError(field: string): string {
		return this.getInputErrorI(field, this.registerForm);
	}

	isValidInputI(input: string, form: FormGroup): boolean | null {
		return form.controls[input].errors && form.controls[input].touched;
	}

	getInputErrorI(input: string, form: FormGroup): string {
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
					errorMessage = `Mínimo ${errors['minlength']['requiredLength']} catacteres`;
					break;
				case 'isValidDni':
					errorMessage = `DNI inválido`;
					break;
				case 'isSamePassword':
					errorMessage = `Las contraseñas no coinciden`
					break;
			}
		}
		return errorMessage;
	}

	register() {
		this.registerError = '';
		if (this.registerForm.valid) {
			let user: User = {
				idUser: '',
				dni: `${this.registerForm.get('dni')?.value}`,
				email: `${this.registerForm.get('email')?.value}`,
				name: `${this.registerForm.get('name')?.value}`,
				itineraryId: `${this.registerForm.get('itinerary')?.value}`,
				password: `${this.registerForm.get('password')?.value}`,
				confirmPassword: `${this.registerForm.get('confirmPassword')?.value}`,
			}
			let registerResp = this.authService.register(user)
				.then((res) => { this.openSuccessfulRegisterModal(res) })
				.catch((err) => this.notifyErrorRegister(err));
		}
	}

	openSuccessfulRegisterModal(res: any) {
		//TODO create modal
		alert('Success register, wait for the account validation'); //todo: change to moda
	}

	notifyErrorRegister(err: any) {
		if ((typeof err.message) === "string") {
			this.registerError = err.message;
		} else {
			this.registerError = 'Error en el registro';
		}
	}

	/*		if (this.registerForm.valid) {
				const user = new User(
					this.registerForm.get("dni")?.value ?? "", // Usa '' como valor predeterminado
					this.registerForm.get("email")?.value ?? "", // Usa '' como valor predeterminado
					this.registerForm.get("password")?.value ?? "",
					this.registerForm.get("repeatpassword")?.value ?? ""
				);
	
			   // Agrega el itineraryId desde environment
			user.itineraryId = environment.ITINERARY_ID;
		    
		  console.log('from register-modal********', user)*/
	/*			this.authService.register(user).subscribe({
					next: (userData) => {console.log('userData ' , userData)},
					error: (errorData) => {
						console.error("Error during registration", errorData);
						this.registerError = errorData.error || 'Error en el registro'; // Accede a la propiedad error de HttpErrorResponse
					
					},
				});
			}*/
	// 	this.closeModal();
	// }
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

	async getItineraries() {
		await this.itinerariesService.getChallenges()
			.then((itineraries) => this.itineraries = itineraries);
	}
}
