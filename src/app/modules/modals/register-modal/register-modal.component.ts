import { environment } from './../../../../environments/environment';
import { User } from './../../../models/user.model';

import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginModalComponent } from "../login-modal/login-modal.component";
import { Validators, FormBuilder } from "@angular/forms";
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
		dni: ["", Validators.required],
		email: ["", Validators.required],
		name: ["", Validators.required],
		itineraryId: ["", Validators.required],
		password: ["", Validators.required],
		confirmPassword: ["", Validators.required],
		legalTermsAccepted: ["", Validators.required],
	});

	constructor(
		private modalService: NgbModal,
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private itinerariesService: ItinerariesService,
	) {}

	ngOnInit(): void {
		this.getItineraries();
	}

	register() {
		this.registerError = '';
		if(this.registerForm.valid){
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
			.then( (res) => {this.openSuccessfulRegisterModal(res)})
			.catch( (err) => this.notifyErrorRegister(err));
		}
	}

	openSuccessfulRegisterModal( res: any){
	//TODO create modal
			alert('Success register, wait for the account validation'); //todo: change to moda
	}

	notifyErrorRegister(err:any){
		if( (typeof err.message) === "string"){
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
		.then( (itineraries) => this.itineraries = itineraries );
	}
}
