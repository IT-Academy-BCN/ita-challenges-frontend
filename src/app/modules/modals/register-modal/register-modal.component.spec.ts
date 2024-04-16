import { type ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing'
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms'
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { of } from 'rxjs'
import { RegisterModalComponent } from './register-modal.component'
import { AuthService } from '../../../services/auth.service'
import { type User } from '../../../models/user.model'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { ChallengeService } from 'src/app/services/challenge.service'

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent
  let fixture: ComponentFixture<RegisterModalComponent>
  let modalServiceMock: any
  let authServiceMock: any
  let challengeServiceMock: any
  let translateService: TranslateService

  beforeEach(async () => {
    modalServiceMock = {
      dismissAll: jest.fn(),
      open: jest.fn()
    }

    authServiceMock = {
      register: jest.fn().mockResolvedValue(of([]))
    }

    challengeServiceMock = {
      getItineraries: jest.fn().mockResolvedValue(['itinerary1', 'itinerary2', 'itinerary3'])
    }

    await TestBed.configureTestingModule({
      declarations: [RegisterModalComponent],
      imports: [FormsModule, ReactiveFormsModule, NgbModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: NgbModal, useValue: modalServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ChallengeService, useValue: challengeServiceMock }

      ]
    }).compileComponents()

    fixture = TestBed.createComponent(RegisterModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    translateService = TestBed.inject(TranslateService)
  })

  it('should create register component', () => {
    expect(component).toBeTruthy()
  })

  it('should register user successfully ', fakeAsync(() => {
    spyOn(component, 'openSuccessfulRegisterModal')
    jest.spyOn(window, 'alert')
    component.registerForm.setValue({
      dni: '12345678Z',
      email: 'test@example.com',
      name: 'testName',
      itineraryId: 'testItinerary',
      password: 'TestPassword1',
      confirmPassword: 'TestPassword1',
      legalTermsAccepted: true
    })

    const testUser: User = {
      idUser: '',
      dni: '12345678Z',
      email: 'test@example.com',
      name: 'testName',
      itineraryId: 'testItinerary',
      password: 'TestPassword1',
      confirmPassword: 'TestPassword1'
    }

    component.register()

    tick()
    expect(component.registerError).toEqual('')
    expect(component.registerForm.touched).toEqual(true)
    expect(component.registerForm.valid).toEqual(true)
    expect(authServiceMock.register).toHaveBeenCalledWith(testUser)
    expect(component.openSuccessfulRegisterModal).toHaveBeenCalled()
  }))

  it('should handle register error', fakeAsync(() => {
    spyOn(component, 'notifyErrorRegister')

    spyOn(authServiceMock, 'register').and.returnValue(Promise.reject(new Error('Registration failed')))

    component.registerForm.setValue({
      dni: '12345678Z',
      email: 'test@example.com',
      name: 'testName',
      itineraryId: 'testItinerary',
      password: 'TestPassword1',
      confirmPassword: 'TestPassword1',
      legalTermsAccepted: true
    })

    const testUser: User = {
      idUser: '',
      dni: '12345678Z',
      email: 'test@example.com',
      name: 'testName',
      itineraryId: 'testItinerary',
      password: 'TestPassword1',
      confirmPassword: 'TestPassword1'
    }

    component.register()

    tick()
    expect(component.registerError).toEqual('')
    expect(component.registerForm.touched).toEqual(true)
    expect(component.registerForm.valid).toEqual(true)
    expect(authServiceMock.register).toHaveBeenCalled()
    expect(authServiceMock.register).toHaveBeenCalledWith(testUser)
    expect(component.notifyErrorRegister).toHaveBeenCalled()
  }))

  it('should set default error message when register error', () => {
    const mockError = { error: { message: { mockKey: 'mock Error' } } }
    spyOn(translateService, 'instant').and.returnValue('Error en el registro, puede ser que ya estés registrado')
    component.notifyErrorRegister(mockError)
    expect(component.registerError).toBe('Error en el registro, puede ser que ya estés registrado')
  })

  it('should open login modal', () => {
    component.openLoginModal()
    expect(modalServiceMock.dismissAll).toHaveBeenCalled()
    expect(modalServiceMock.open).toHaveBeenCalled()
  })

  it('should close register modal', () => {
    component.openLoginModal()
    expect(modalServiceMock.dismissAll).toHaveBeenCalled()
  })

  it('should get itineraries B', async () => {
    const respMock: string[] = ['itinerary1', 'itinerary2', 'itinerary3']
    // tick()
    await component.getItineraries()
    expect(component.itineraries).toEqual(respMock)
  })
})
