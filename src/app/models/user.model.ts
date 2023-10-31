export class User {
	dni: string;
	email: string;
	password: string;
	repeatpassword: string;

	constructor(
		dni: string,
		email: string,
		password: string,
		repeatpassword: string
	) {
		this.dni = dni;
		this.email = email;
		this.password = password;
		this.repeatpassword = repeatpassword;
	}
}