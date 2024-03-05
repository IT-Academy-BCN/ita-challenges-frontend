import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormsModule, AbstractControl } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { RegisterModalComponent } from './register-modal.component';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { ItinerariesService } from './../../../services/itineraries.service';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;
  let modalServiceMock: any;
  let authServiceMock: any;
  let itinerariesServiceMock: any;
  let validatorsServiceMock: any;

  beforeEach(async () => {

    modalServiceMock = {
      dismissAll: jest.fn(),
      open: jest.fn(),
    };

    authServiceMock = {
      register: jest.fn().mockResolvedValue(of([])),
    }

    itinerariesServiceMock = {
      getItineraries: jest.fn().mockResolvedValue(['itinerary1', 'itinerary2', 'itinerary3']),
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

  it('should register user successfully ', fakeAsync(() => {
    spyOn(component, 'openSuccessfulRegisterModal');
    jest.spyOn(window, 'alert');
    component.registerForm.setValue({
      dni: '12345678Z',
      email: 'test@example.com',
      name: 'testName',
      itineraryId: 'testItinerary',
      password: 'testPassword',
      confirmPassword: 'testPassword',
      legalTermsAccepted: true,
    });

    let testUser: User = {
      idUser: '',
      dni: '12345678Z',
      email: 'test@example.com',
      name: 'testName',
      itineraryId: 'testItinerary',
      password: 'testPassword',
      confirmPassword: 'testPassword',
    }

    component.register();

    tick();
    expect(component.registerError).toEqual('');
    expect(component.registerForm.touched).toEqual(true);
    expect(component.registerForm.valid).toEqual(true);
    expect(authServiceMock.register).toHaveBeenCalledWith(testUser);
    expect(component.openSuccessfulRegisterModal).toHaveBeenCalled();
  }));
  
  it('should handle register error', fakeAsync(() => {
    spyOn(component, 'notifyErrorRegister');
    
    spyOn(authServiceMock, 'register').and.returnValue(Promise.reject('')); 

    component.registerForm.setValue({
      dni: '12345678Z',
      email: 'test@example.com',
      name: 'testName',
      itineraryId: 'testItinerary',
      password: 'testPassword',
      confirmPassword: 'testPassword',
      legalTermsAccepted: true,
    });
    
    let testUser: User = {
      idUser: '',
      dni: '12345678Z',
      email: 'test@example.com',
      name: 'testName',
      itineraryId: 'testItinerary',
      password: 'testPassword',
      confirmPassword: 'testPassword',
    }

    component.register();

    tick();
    expect(component.registerError).toEqual('');
    expect(component.registerForm.touched).toEqual(true);
    expect(component.registerForm.valid).toEqual(true);
    expect(authServiceMock.register).toHaveBeenCalled();
    expect(authServiceMock.register).toHaveBeenCalledWith(testUser);
    expect(component.notifyErrorRegister).toHaveBeenCalled();
  }));

  it('should set default error message when register error', () => {
    const mockError= { error: { message: { mockKey: 'mockValue' } } };
    component.notifyErrorRegister(mockError);
    expect(component.registerError).toEqual('Error en el registro, puede ser que ya estés registrado');
});

  it('should open login modal', () => {
    component.openLoginModal();
    expect(modalServiceMock.dismissAll).toHaveBeenCalled();
    expect(modalServiceMock.open).toHaveBeenCalled();
  });

  it('should close register modal', () => {
    component.openLoginModal();
    expect(modalServiceMock.dismissAll).toHaveBeenCalled();
  });

  it('should get itineraries', fakeAsync(() => {
    let respMock: string[] = ['itinerary1', 'itinerary2', 'itinerary3'];
    tick()
    component.getItineraries();
    expect(component.itineraries).toEqual(respMock);
  }));

});