/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-readonly */
/* eslint-disable @typescript-eslint/consistent-type-imports */

import { HttpClient } from '@angular/common/http'
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { CommonModule } from '@angular/common'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { AuthService } from 'src/app/services/auth.service'

declare let bootstrap: any

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
  imports: [CommonModule, TranslateModule, ReactiveFormsModule]
})

export class MentorLoginComponent implements OnInit {
  @Output() loginSuccess = new EventEmitter<boolean>()

  isErrorVisible = false
  isShowTermsError = false
  errorMessage = ''
  isLoading = false

  route = inject(ActivatedRoute)
  http = inject(HttpClient)
  router = inject(Router)
  translate = inject(TranslateService)
  authService = inject(AuthService)

  loginForm = new FormGroup({
    termsCheck: new FormControl(false, { nonNullable: true })
  })

  ngOnInit (): void {
    this.checkGitHubCode()
  }

  ngAfterViewInit (): void {
    const modalElement = document.getElementById('mentorLoginModal')
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => { this.closeModal() })
    }
  }

  checkGitHubCode (): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code']

      if (!(code)) return

      this.openModal()
      this.isLoading = true
      this.loginForm.controls.termsCheck.setValue(true)
      this.loginForm.controls.termsCheck.disable()

      this.authenticateWithGitHub(code)
    })
  }

  authenticateWithGitHub (code: string): void {
    const url =
    environment.BACKEND_ITA_CHALLENGE_BASE_URL +
    environment.BACKEND_GITHUB_VALIDATE_ENDPOINT

    this.http.post<GitHubAuthResponse>(url, { code }).subscribe({
      next: (response) => {
        if (response.isValid) {
          localStorage.setItem('authToken', response.token)
          localStorage.setItem('username', response.username)
          
          this.authService.updateUserRoleAndUserNameFromToken()

          this.closeModal()
          this.loginSuccess.emit(true)
        } else {
          this.showError('unauthorized')
          localStorage.removeItem('username')
          localStorage.removeItem('authToken')
        }
      },
      error: (err) => {
        this.isLoading = false
        this.resetForm()
        this.loginForm.controls.termsCheck.setValue(true)

        if (err.status === 401) {
          this.showError('unauthorized') // Error 401: No autorizado. El usuario no es mentor o el token es inválido
        } else if (err.status === 500) {
          this.showError('server_error')
        } else if (err.status === 403) {
          this.showError('unauthorized') // Error 403: El usuario no existe en GitHub.
          localStorage.removeItem('username')
          localStorage.removeItem('authToken')
        } else {
          this.showError('unauthorized')
          console.error(err)
        }
      }
    })
    
    void this.router.navigate([], {
      queryParams: { code: null },
      queryParamsHandling: 'merge'
    })
  }

  loginWithGitHub (): void {
    if (!this.loginForm.controls.termsCheck.value) {
      this.closeError()
      this.isShowTermsError = true
      return
    }

    this.closeError()
    this.isLoading = true
    this.loginForm.controls.termsCheck.disable()

    const clientId = environment.GITHUB_CLIENT_ID
    const redirectUri = environment.AUTH_REDIRECT_URL

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email`

    window.location.href = githubAuthUrl
  }

  redirectToRegister (): void {
    window.location.href = 'https://github.com/signup'
  }

  showError (errorKey: string): void {
    this.translate.get(`messages.errors.${errorKey}`).subscribe((translatedMessage: string) => {
      this.errorMessage = translatedMessage
      this.isErrorVisible = true
    })
  }

  closeError (): void {
    this.isErrorVisible = false
    this.isShowTermsError = false
  }

  resetForm (): void {
    this.isLoading = false
    this.loginForm.controls.termsCheck.setValue(false)
    this.loginForm.controls.termsCheck.enable()
    this.closeError()
  }

  openModal (): void {
    const modalElement = document.getElementById('mentorLoginModal')
    if (modalElement !== null) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement)
      modalInstance.show()
    }
  }

  closeModal (): void {
    const modalElement = document.getElementById('mentorLoginModal')
    if (modalElement !== null) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement)
      if (modalInstance !== null) {
        this.resetForm()
        modalInstance.hide()
      }
    }
    this.closeError()
    document.activeElement instanceof HTMLElement && document.activeElement.blur()
  }
}
