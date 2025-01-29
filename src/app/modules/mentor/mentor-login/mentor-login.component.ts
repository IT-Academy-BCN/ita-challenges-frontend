// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Component, OnInit } from '@angular/core'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActivatedRoute } from '@angular/router'

@Component({
  standalone: true,
  selector: 'app-mentor-login',
  templateUrl: './mentor-login.component.html',
  styleUrls: ['./mentor-login.component.scss']
})
export class MentorLoginComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  constructor (private route: ActivatedRoute) {}

  ngOnInit (): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code']
      if (code !== null && code !== undefined) {
        console.log('GitHub code recibido:', code)
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
