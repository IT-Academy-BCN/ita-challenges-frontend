export interface loginUser{
    dni: 'string',
    password: 'string'
}

export interface registerUser extends loginUser{
    email: 'string',
    repeatpassword: 'string'
}