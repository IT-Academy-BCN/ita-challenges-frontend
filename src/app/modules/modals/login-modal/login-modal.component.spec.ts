import { AuthService } from './../../../services/auth.service'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { Router } from '@angular/router'
import { of, throwError } from 'rxjs'
import { User } from 'src/app/models/user.model'

import { LoginModalComponent } from './login-modal.component'
import { error } from 'node:console'
import { TranslateModule } from '@ngx-translate/core'

describe('LoginModalComponent', () => {
  let component: LoginModalComponent
  let fixture: ComponentFixture<LoginModalComponent>
  let authServiceMock: any
  let routerMock: any
  let modalServiceMock: any

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
      notifyErrorLogin: jest.fn()
    }
    routerMock = {
      navigateByUrl: jest.fn()
    }
    modalServiceMock = {
      dismissAll: jest.fn(),
      open: jest.fn()
    }

    await TestBed.configureTestingModule({
      declarations: [LoginModalComponent],
      imports: [FormsModule, ReactiveFormsModule, NgbModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NgbModal, useValue: modalServiceMock }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(LoginModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create login component correctly', (done) => {
    expect(component).toBeTruthy()
    done()
  })

  it('should not call authService.login if form is invalid', (done) => {
    component.login()
    expect(authServiceMock.login).not.toHaveBeenCalled()
    done()
  })

  it('should call authService.login and success response if form is valid', async () => {
    component.loginForm.setValue({ dni: '12345678Z', password: 'password' })
    authServiceMock.login.mockReturnValue(of({
      idUser: '',
      dni: component.loginForm.get('dni')?.value,
      password: component.loginForm.get('password')?.value
    }))
    component.login()

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(authServiceMock.login).toHaveBeenCalled()
    expect(modalServiceMock.dismissAll).toHaveBeenCalled()
    // expect(modalServiceMock.open).toHaveBeenCalled(); //todo: need the succesfull modal
  })

  it('should handle login error', async () => {
    component.loginForm.setValue({ dni: '12345678Z', password: 'password' })
    const errorResponse = { error: { message: 'Error en el login' } }

    spyOn(authServiceMock, 'login').and.returnValue(Promise.reject(errorResponse))

    await component.login()

    await new Promise(resolve => setTimeout(resolve, 100))
    expect(component.loginError).toEqual(errorResponse.error.message)
  })

  it('should open register modal', (done) => {
    component.openRegisterModal()
    expect(modalServiceMock.dismissAll).toHaveBeenCalled()
    expect(modalServiceMock.open).toHaveBeenCalled()
    done()
  })

  it('should close login modal', (donde) => {
    component.openRegisterModal()
    expect(modalServiceMock.dismissAll).toHaveBeenCalled()
    donde()
  })
})
