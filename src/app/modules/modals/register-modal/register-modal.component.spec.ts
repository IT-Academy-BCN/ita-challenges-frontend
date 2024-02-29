import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormsModule, AbstractControl } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { RegisterModalComponent } from './register-modal.component';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';


import { ItinerariesService } from './../../../services/itineraries.service';
import { ValidatorsService } from './../../../services/validators.service';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;
  let modalServiceMock: any;
  // let formBuilderMock: any;
  let authServiceMock: any;
  let itinerariesServiceMock: any;
  let validatorsServiceMock: any;

  beforeEach(async () => {

    modalServiceMock = {
      dismissAll: jest.fn(),
      open: jest.fn(),
    };

    authServiceMock = {
      register: jest.fn(),
    }

    itinerariesServiceMock = {
      getChallenges: jest.fn().mockResolvedValue(of([])),
    }

    await TestBed.configureTestingModule({
      declarations: [RegisterModalComponent],
      imports: [FormsModule, ReactiveFormsModule, NgbModule],
      providers: [
        FormBuilder,
        { provide: NgbModal, useValue: modalServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ItinerariesService, useValue: itinerariesServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create register component', () => {
    expect(component).toBeTruthy();
  });

  // it('should register user on valid form submission', fakeAsync(() => {
  //   // spyOn(authServiceMock, 'register').and.returnValue(throwError({ error: 'Registration failed' }));
  //   component.registerForm.setValue({
  //     dni: '12345678Z',
  //     email: 'test@example.com',
  //     name: 'testName',
  //     itineraryId: 'testItinerary',
  //     password: 'testPassword',
  //     confirmPassword: 'testPassword',
  //     legalTermsAccepted: true,
  //   });

  //   component.register();

  //   tick();
    // expect(component.registerError).toEqual('');
    // expect(component.registerForm.touched).toEqual(true);
    // console.log(component.registerForm.get('dni')?.valid)
    // console.log(component.registerForm.get('email')?.valid)
    // console.log(component.registerForm.get('name')?.valid)
    // console.log(component.registerForm.get('itineraryId')?.valid)
    // console.log(component.registerForm.get('password')?.valid)
    // console.log(component.registerForm.get('confirmPassword')?.valid)
    // console.log(component.registerForm.get('legalTermsAccepted')?.valid, component.registerForm.get('legalTermsAccepted')?.value, )
    
    // expect(component.registerForm.valid).toEqual(true);
    


  // }));



  // it('should handle registration error', fakeAsync(() => {
  //TODO revise this test
  //     spyOn(authService, 'register').and.returnValue(throwError({ error: 'Registration failed' }));

  //     component.registerForm.setValue({
  //       dni: '12345678',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       repeatpassword: 'password123',
  //     });

  //     component.register();
  //     tick();

  //     expect(component.registerError).toEqual('Registration failed');
  // }));

});
