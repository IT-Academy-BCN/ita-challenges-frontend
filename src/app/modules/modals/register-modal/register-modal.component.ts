import { environment } from './../../../../environments/environment';
import { User } from './../../../models/user.model';

import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginModalComponent } from "../login-modal/login-modal.component";
import { Validators, FormBuilder } from "@angular/forms";
import { AuthService } from './../../../services/auth.service';
import { ItinerariesService } from './../../../services/itineraries.service';
import { Itinerary } from 'src/app/models/itinerary.interface';
import { ValidatorsService } from 'src/app/services/validators.service';
import { TranslateService } from '@ngx-translate/core';
import { PostRegisterModalComponent } from '../post-register-modal/post-register-modal.component';

@Component({
	selector: "app-register-modal",
	templateUrl: "./register-modal.component.html",
	styleUrls: ["./register-modal.component.scss"],
})
export class RegisterModalComponent implements OnInit {
	registerError: string = "";
	itineraries: Itinerary[] = [];

	registerForm = this.formBuilder.group({
		dni: ["", Validators.required, this.validatorsService.isValidDni],
		email: ["", [Validators.required, Validators.pattern(this.validatorsService.emailPattern)]],
		name: ["", Validators.required],
		itineraryId: ["", Validators.required],
		password: ["", [Validators.required, Validators.minLength(8)], this.validatorsService.isValidPassword ],
		confirmPassword: ["", [Validators.required, Validators.minLength(8)] ],
		legalTermsAccepted: [false, Validators.required, this.validatorsService.checkBoxChecked],
	},{
		validators: [
			this.validatorsService.isSamePassword('password', 'confirmPassword'),
		]
	});

	constructor(
		private modalService: NgbModal,
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private itinerariesService: ItinerariesService,
		private validatorsService: ValidatorsService,
		private translate: TranslateService){
	}

	ngOnInit(): void {
		this.getItineraries();
		this.registerForm.markAsUntouched()
	}

	isValidInput(input: string ): boolean | null {
		return this.validatorsService.isValidInput(input, this.registerForm);
	}

	getInputError(field: string): string {
		return this.validatorsService.getInputError(field, this.registerForm);
	}

	register() {
		this.registerError = '';
		this.registerForm.markAllAsTouched();
		if (this.registerForm.valid) {
			let user: User = {
				idUser: '',
				dni: `${this.registerForm.get('dni')?.value}`,
				email: `${this.registerForm.get('email')?.value}`,
				name: `${this.registerForm.get('name')?.value}`,
				itineraryId: `${this.registerForm.get('itineraryId')?.value}`,
				password: `${this.registerForm.get('password')?.value}`,
				confirmPassword: `${this.registerForm.get('confirmPassword')?.value}`,
			}
			let registerResp = this.authService.register(user)
				.then((res) => { this.openSuccessfulRegisterModal() })
				.catch((err) => this.notifyErrorRegister(err));
		}
	}

	openSuccessfulRegisterModal() {
		this.closeModal();
		this.modalService.open(PostRegisterModalComponent, {
			backdrop: "static",
			centered: true,
			size: "lg",
		});
	}

	notifyErrorRegister(err: any) {
		this.registerError =   this.translate.instant('modules.modals.register.errorMsg');
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

	async getItineraries() {
		await this.itinerariesService.getItineraries()
			.then((itineraries) => this.itineraries = itineraries);
	}
}
