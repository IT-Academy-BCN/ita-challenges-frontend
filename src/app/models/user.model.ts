export class User {
	dni: string;
	email: string;
	password: string;
	confirmPassword: string;
	token?: string;
	itineraryId?: string;
	name?: string;
	accept?: boolean;

	constructor(
		dni: string,
		email: string,
		password: string,
		confirmPassword: string,
		itineraryId?: string,
		// name: string,
		// accept: boolean
	) {
		this.dni = dni;
		this.email = email;
		this.password = password;
		this.confirmPassword = confirmPassword;
		this.itineraryId = itineraryId;
		// this.name = name;
		// this.accept = accept;
	}
}
