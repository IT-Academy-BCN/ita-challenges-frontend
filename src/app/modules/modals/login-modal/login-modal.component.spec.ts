import { AuthService } from './../../../services/auth.service'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { Router } from '@angular/router'
import { of } from 'rxjs'

import { LoginModalComponent } from './login-modal.component';
import { error } from 'node:console';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let modalServiceMock: any;
  let translateService: TranslateService;

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

    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    translateService = TestBed.inject(TranslateService);
  });

  it('should create login component correctly', (done) => {
    expect(component).toBeTruthy()
    done()
  })

  it('should not call authService.login if form is invalid', async () => {
    await component.login()
    expect(authServiceMock.login).not.toHaveBeenCalled()
  })

  it('should call authService.login and success response if form is valid', async () => {
    component.loginForm.setValue({ dni: '12345678Z', password: 'password' })
    authServiceMock.login.mockReturnValue(of({
      idUser: '',
      dni: component.loginForm.get('dni')?.value,
      password: component.loginForm.get('password')?.value
    }))
    await component.login()

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(authServiceMock.login).toHaveBeenCalled()
    expect(modalServiceMock.dismissAll).toHaveBeenCalled()
    // expect(modalServiceMock.open).toHaveBeenCalled(); //todo: need the succesfull modal
  })

  it('should handle login error', async () => {
    let errorMessage: string = 'Usuario desactivado. Espere al email de confirmación';
    let errorResponse = { status: 403 };
    component.loginForm.setValue({ dni: '12345678Z', password: 'password' });
    spyOn(translateService, 'instant').and.returnValue(errorMessage);
    spyOn(authServiceMock, 'login').and.returnValue(Promise.reject(errorResponse));
    await component.login();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(component.loginError).toEqual(errorMessage);
  });

  it('should open register modal', (done) => {
    component.openRegisterModal()
    expect(modalServiceMock.dismissAll).toHaveBeenCalled()
    expect(modalServiceMock.open).toHaveBeenCalled()
    done()
  })

  it('should close login modal', (done) => {
    component.openRegisterModal();
    expect(modalServiceMock.dismissAll).toHaveBeenCalled();
    done();
  });
});
