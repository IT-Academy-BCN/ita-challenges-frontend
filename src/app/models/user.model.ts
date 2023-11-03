export class User {
	dni: string;
	email: string;
	password: string;
	confirmPassword: string;
	token?: string;
// 	specialization?: string;
//   name?: string;
//   accept?: boolean;

	constructor(
		dni: string,
		email: string,
		password: string,
		confirmPassword: string,
		// specialization: string,
		// name: string,
		// accept: boolean
	) {
		this.dni = dni;
		this.email = email;
		this.password = password;
		this.confirmPassword = confirmPassword;
		// this.specialization = specialization;
		// this.name = name;
		// this.accept = accept;
		
	}
}