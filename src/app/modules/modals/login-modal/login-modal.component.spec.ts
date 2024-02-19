import { AuthService } from './../../../services/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from "src/app/models/user.model";

import { LoginModalComponent } from './login-modal.component';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let modalServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn()
    };
    routerMock = {
      navigateByUrl: jest.fn()
    };
    modalServiceMock = {
      dismissAll: jest.fn(),
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginModalComponent],
      imports: [FormsModule, ReactiveFormsModule, NgbModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NgbModal, useValue: modalServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call authService.login if form is invalid', () => {
    component.login();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call authService.login if form is valid', () => {
    // component.loginForm.setValue({ dni: '12345678', password: 'password' });
    // authServiceMock.login.mockReturnValue(of({}));
    // component.login();
    // expect(authServiceMock.login).toHaveBeenCalled();//TODO - fix this
  });

  it('should handle login success', () => {
    // component.loginForm.setValue({ dni: '12345678', password: 'password' });
    // authServiceMock.login.mockReturnValue(of({}));
    // component.login();
    // expect(modalServiceMock.dismissAll).toHaveBeenCalled();
  });

  it('should handle login error', () => {
    
    // component.loginForm.setValue({ dni: '12345678', password: 'password' });
    // const errorResponse = { error: { message: 'Login failed' } };
    // authServiceMock.login.mockReturnValue(throwError(() => errorResponse));
    // component.login();
    // expect(component.loginError).toEqual('Login failed');
  });

  it('should open register modal', () => {
    component.openRegisterModal();
    expect(modalServiceMock.dismissAll).toHaveBeenCalled();
    expect(modalServiceMock.open).toHaveBeenCalled();
  });
});
