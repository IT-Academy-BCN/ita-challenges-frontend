import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { MentorLoginComponent } from './mentor-login.component'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter, ActivatedRoute } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { ReactiveFormsModule } from '@angular/forms'
import { of, BehaviorSubject, throwError } from 'rxjs'
import { environment } from 'src/environments/environment'
import { AuthService } from 'src/app/services/auth.service'

declare global {
  interface Window {
    bootstrap: any
  }
}

window.bootstrap = {
  Modal: jest.fn().mockImplementation(() => ({
    hide: jest.fn(),
    show: jest.fn()
  }))
}
window.bootstrap.Modal.getInstance = jest.fn().mockReturnValue({
  hide: jest.fn()
})

interface ErrorHandlingTestCase {
  statusCode: number
  expectedError: string
}

describe('MentorLoginComponent', () => {
  let component: MentorLoginComponent
  let fixture: ComponentFixture<MentorLoginComponent>
  let queryParams$: BehaviorSubject<any>
  let authServiceMock: { updateUserRoleAndUserNameFromToken: jest.Mock }

  beforeEach(async () => {
    queryParams$ = new BehaviorSubject<any>({})
    authServiceMock = {
      updateUserRoleAndUserNameFromToken: jest.fn()
    }

    const activatedRouteMock = {
      queryParams: queryParams$.asObservable()
    }

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MentorLoginComponent
      ],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorLoginComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('✅ Should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('✅ Should enable the login button when terms are accepted', () => {
    component.loginForm.controls.termsCheck.setValue(true)
    fixture.detectChanges()
    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('.github-button')
    expect(button).toBeTruthy()
    expect(button?.disabled).toBe(false)
  })

  it('✅ Should show an error if login is attempted without accepting terms', () => {
    component.loginWithGitHub()
    expect(component.isShowTermsError).toBe(true)
  })

  it('✅ Should disable the checkbox and activate loading when logging in', () => {
    component.loginForm.controls.termsCheck.setValue(true)
    component.loginWithGitHub()
    expect(component.loginForm.controls.termsCheck.disabled).toBe(true)
    expect(component.isLoading).toBe(true)
  })

  it('✅ Should open the modal', () => {
    const modalSpy = jest.spyOn(window.bootstrap.Modal, 'getInstance').mockReturnValue({
      show: jest.fn()
    })

    component.openModal()
    fixture.detectChanges()

    expect(modalSpy).toHaveBeenCalled()
  })

  it('✅ Should close the modal and reset the form', () => {
    const modalSpy = jest.spyOn(window.bootstrap.Modal, 'getInstance').mockReturnValue({
      hide: jest.fn()
    })

    component.closeModal()
    fixture.detectChanges()

    expect(modalSpy).toHaveBeenCalled()
    expect(component.isLoading).toBe(false)
  })

  describe('GitHub Authentication', () => {
    it('✅ Should open modal and disable terms checkbox when code is present', () => {
      jest.spyOn(component, 'openModal').mockImplementation(() => {})

      queryParams$.next({ code: 'test123' })
      component.checkGitHubCode()
      fixture.detectChanges()

      expect(component.isLoading).toBe(true)
      expect(component.loginForm.controls.termsCheck.value).toBe(true)
      expect(component.loginForm.controls.termsCheck.disabled).toBe(true)
    })

    it('✅ Should do nothing if no code is present in queryParams', () => {
      const authSpy = jest.spyOn<any, any>(component, 'authenticateWithGitHub')

      queryParams$.next({})
      component.checkGitHubCode()
      fixture.detectChanges()

      expect(authSpy).not.toHaveBeenCalled()
    })
  })

  it('✅ Should store user data and navigate when GitHub authentication is successful', () => {
    const mockResponse = { isValid: true, username: 'testUser', token: '123456' }
    const httpSpy = jest.spyOn(component.http, 'post').mockReturnValue(of(mockResponse))
    const routerSpy = jest.spyOn(component.router, 'navigate').mockResolvedValue(true)
    const modalSpy = jest.spyOn(component, 'closeModal')
    const loginSuccessSpy = jest.spyOn(component.loginSuccess, 'emit')

    component.authenticateWithGitHub('testCode')

    expect(httpSpy).toHaveBeenCalledWith(
      environment.BACKEND_ITA_CHALLENGE_BASE_URL + environment.BACKEND_GITHUB_VALIDATE_ENDPOINT,
      { code: 'testCode' }
    )
    expect(sessionStorage.getItem('username')).toBe('testUser')
    expect(sessionStorage.getItem('authToken')).toBe('123456')
    expect(authServiceMock.updateUserRoleAndUserNameFromToken).toHaveBeenCalled()
    expect(routerSpy).toHaveBeenCalledWith([], { queryParams: { code: null }, queryParamsHandling: 'merge' })
    expect(modalSpy).toHaveBeenCalled()
    expect(loginSuccessSpy).toHaveBeenCalledWith(true)
  })

  it.each<ErrorHandlingTestCase>([
    { statusCode: 401, expectedError: 'unauthorized' },
    { statusCode: 403, expectedError: 'unauthorized' },
    { statusCode: 500, expectedError: 'server_error' },
    { statusCode: 404, expectedError: 'unauthorized' }
  ])('❌ Should handle error %i and show error message', ({ statusCode, expectedError }, done) => {
    sessionStorage.setItem('username', 'testUser')
    sessionStorage.setItem('authToken', '123456')

    const httpSpy = jest.spyOn(component.http, 'post').mockReturnValue(
      throwError(() => ({ status: statusCode }))
    )

    const errorSpy = jest.spyOn(component, 'showError')
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    component.authenticateWithGitHub('testCode')

    setTimeout(() => {
      expect(httpSpy).toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalledWith(expectedError)
      expect(component.isLoading).toBe(false)
      if (statusCode === 403) {
        expect(sessionStorage.getItem('username')).toBeNull()
        expect(sessionStorage.getItem('authToken')).toBeNull()
      }
      if (statusCode === 404) {
        expect(consoleSpy).toHaveBeenCalled()
      }
      consoleSpy.mockRestore()

      done()
    }, 100)
  })

  it('✅ Should hide the error when closeError is called', () => {
    component.isErrorVisible = true
    component.isShowTermsError = true

    component.closeError()
    fixture.detectChanges()

    expect(component.isErrorVisible).toBe(false)
    expect(component.isShowTermsError).toBe(false)
  })

  it('✅ Should redirect to GitHub signup', () => {
    delete (window as any).location
    window.location = { href: '' } as any
    
    component.redirectToRegister()
    
    expect(window.location.href).toBe('https://github.com/signup')
  })
})
