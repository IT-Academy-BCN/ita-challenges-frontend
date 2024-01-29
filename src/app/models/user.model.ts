export class User {
	idUser: string;
	dni?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
	itineraryId?: string;

	constructor(
		idUser: string,
		dni?: string,
		email?: string,
		password?: string,
		confirmPassword?: string,
		itineraryId?: string
	) {
		this.idUser = idUser;
		this.dni = dni;
		this.email = email;
		this.password = password;
		this.confirmPassword = confirmPassword;
		this.itineraryId = itineraryId;
	}
}
