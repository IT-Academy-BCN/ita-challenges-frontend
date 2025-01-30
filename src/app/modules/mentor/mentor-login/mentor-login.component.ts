/* eslint-disable @typescript-eslint/prefer-readonly */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment.prod'

@Component({
  standalone: true,
  selector: 'app-mentor-login',
  templateUrl: './mentor-login.component.html',
  styleUrls: ['./mentor-login.component.scss']
})
export class MentorLoginComponent implements OnInit {
  constructor (private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit (): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code']
      if (code !== null && code !== undefined) {
        console.log('GitHub code recibido:', code)

        const url = environment.BACKEND_ITA_CHALLENGE_BASE_URL + environment.BACKEND_GITHUB_VALIDATE_ENDPOINT

        this.http.post(url, { code })
          .subscribe({
            next: (response: any) => {
              console.log('GitHub backend response:', response)

              if (response.status === 'success') {
                void this.router.navigate(['/ita-challenge/challenges'])
              } else {
                console.error('no eres mentor, acceso denegado')
              }
            }
          })
      }
    })
  }

  loginWithGitHub (): void {
    const clientId = 'Ov23liatIZRCf3flyPtL'
    const redirectUri = 'http://localhost:4200/ita-challenge/mentor'

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email`

    window.location.href = githubAuthUrl
  }
}
