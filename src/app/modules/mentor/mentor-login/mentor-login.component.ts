/* eslint-disable @typescript-eslint/prefer-readonly */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'

interface GitHubAuthResponse {
  isValid: boolean
  username: string
}

@Component({
  standalone: true,
  selector: 'app-mentor-login',
  templateUrl: './mentor-login.component.html',
  styleUrls: ['./mentor-login.component.scss']
})
export class MentorLoginComponent implements OnInit {
  constructor (
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
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
              alert(`✅ Bienvenido, ${response.username}! Redirigiendo...`)
              localStorage.setItem('username', response.username)
              void this.router.navigate(['/ita-challenge/challenges'])
            } else {
              alert('❌ No eres mentor, acceso denegado.')
            }
          },
          error: (err) => {
            if (err.status === 401) {
              console.error(
                '🚫 Error 401: No autorizado. El usuario no es mentor o el token es inválido.'
              )
            } else if (err.status === 500) {
              console.error('💥 Error 500: Error interno en el servidor.')
            } else {
              console.error(
                '❌ Error desconocido en la petición al backend:',
                err
              )
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
}
