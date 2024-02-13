import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { RegisterModalComponent } from './register-modal.component';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;
  let authService: AuthService;
  let modalService: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        NgbModal,
        { provide: AuthService, useValue: { register: jest.fn() } as any },
      ],
    });

    fixture = TestBed.createComponent(RegisterModalComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register user on valid form submission', fakeAsync(() => {
    const spyRegister = spyOn(authService, 'register').and.returnValue(of({}));
    component.registerForm.setValue({
      dni: '12345678',
      email: 'test@example.com',
      password: 'password123',
      repeatpassword: 'password123',
    });
  
    component.register();
    tick();
    fixture.detectChanges();
  
    // Assuming User is the correct type that register method expects
    expect(spyRegister).toHaveBeenCalledWith(jasmine.any(User));
  }));
  
  

  it('should handle registration error', fakeAsync(() => {
    spyOn(authService, 'register').and.returnValue(throwError({ error: 'Registration failed' }));

    component.registerForm.setValue({
      dni: '12345678',
      email: 'test@example.com',
      password: 'password123',
      repeatpassword: 'password123',
    });

    component.register();
    tick();

    expect(component.registerError).toEqual('Registration failed');
  }));
});
