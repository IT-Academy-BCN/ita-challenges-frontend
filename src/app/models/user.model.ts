export class User {
	idUser: string;
	dni?: string;
	email?: string;
	name?: string;
	itineraryId?: string;
	password?: string;
	confirmPassword?: string;
	

	constructor(
		idUser: string,
		dni?: string,
		password?: string,
		email?: string,
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
