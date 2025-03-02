/* eslint-disable @typescript-eslint/prefer-readonly */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


interface GitHubAuthResponse {
  isValid: boolean
  username: string
  token: string
}

@Component({
  standalone: true,
  selector: 'app-mentor-login',
  templateUrl: './mentor-login.component.html',
  styleUrls: ['./mentor-login.component.scss'],
  imports: [CommonModule, TranslateModule] 
})

export class MentorLoginComponent implements OnInit {

  isErrorVisible = false;
  isSuccessVisible = false;
  errorMessage = '';
  successMessage = '';
  showRegisterButton = false;

  constructor (
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService
  ) {}



  ngOnInit (): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code']
      if (code !== null && code !== undefined) {
        console.log('GitHub code recibido:', code)

        const url =
          environment.BACKEND_ITA_CHALLENGE_BASE_URL +
          environment.BACKEND_GITHUB_VALIDATE_ENDPOINT

        this.http.post<GitHubAuthResponse>(url, { code }).subscribe({
          next: (response) => {
            console.log('GitHub backend response:', response)

            if (response.isValid) {
              this.showSuccess(response.username)
              localStorage.setItem('username', response.username)
              localStorage.setItem('authToken', response.token)
              setTimeout(()=>{
                void this.router.navigate(['/ita-challenge/challenges']);
              }, 1500)
            } else {
              this.showError('unauthorized')
              localStorage.removeItem('username')
              localStorage.removeItem('authToken')
            }
          },
          error: (err) => {
            if (err.status === 401) {
              this.showError('unauthorized')  //Error 401: No autorizado. El usuario no es mentor o el token es inválido
              
            } else if (err.status === 500) {
              this.showError('unauthorized')  //Error 500: Error interno en el servidor.
              console.log('💥 Error 500: Error interno en el servidor.')
            } else if (err.status === 403){
              this.showError('unauthorized');  //Error 403: El usuario no existe en GitHub.
              localStorage.removeItem('username')
              localStorage.removeItem('authToken')
            } else {
              this.showError('unauthorized'),
              console.log(err)
            }
          }
        })
      }
    })
  }

  loginWithGitHub (): void {
    const clientId = environment.GITHUB_CLIENT_ID
    const redirectUri = environment.GITHUB_REDIRECT_URI

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email`

    window.location.href = githubAuthUrl
  }


  showError(errorKey: string) {
    this.translate.get(`messages.errors.${errorKey}`).subscribe((translatedMessage: string) => {
      this.errorMessage = translatedMessage;
      this.isErrorVisible = true;
    });
  }
  
  showSuccess(username: string) {
    this.translate.get('messages.success.welcome', { username }).subscribe((translatedMessage: string) => {
      this.successMessage = translatedMessage;
      this.isSuccessVisible = true;
    });
  }

  closeSuccess(){
    this.isSuccessVisible = false
  }
  closeError(){
    this.isErrorVisible = false
  }

  redirectToRegister(): void {
    window.location.href = 'https://github.com/signup';
  }
  
}
