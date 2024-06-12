import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { RestrictedModalComponent } from './restricted-modal.component'
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { Router } from '@angular/router'
import { RegisterModalComponent } from '../register-modal/register-modal.component'
import { LoginModalComponent } from '../login-modal/login-modal.component'
import { TranslateModule } from '@ngx-translate/core'

describe('RestrictedModalComponent', () => {
  let component: RestrictedModalComponent
  let fixture: ComponentFixture<RestrictedModalComponent>
  let modalServiceMock: any
  let routerMock: any

  beforeEach(async () => {
    // Crear versiones simuladas de NgbModal y Router
    modalServiceMock = {
      dismissAll: jest.fn(),
      open: jest.fn()
    }

    routerMock = {
      navigateByUrl: jest.fn()
    }

    await TestBed.configureTestingModule({
      declarations: [RestrictedModalComponent],
      imports: [NgbModule, TranslateModule.forRoot()],
      providers: [
        { provide: NgbModal, useValue: modalServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(RestrictedModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should close modal when closeModal is called', () => {
    component.closeModal()
    expect(modalServiceMock.dismissAll).toHaveBeenCalled()
  })

  it('should close and open login modal when openLoginModal is called', () => {
    component.openLoginModal()
    expect(modalServiceMock.dismissAll).toHaveBeenCalled()
    expect(modalServiceMock.open).toHaveBeenCalledWith(LoginModalComponent, {
      centered: true,
      size: 'lg'
    })
  })

  it('should close and open register modal when openRegisterModal is called', () => {
    component.openRegisterModal()
    expect(modalServiceMock.dismissAll).toHaveBeenCalled()
    expect(modalServiceMock.open).toHaveBeenCalledWith(RegisterModalComponent, {
      centered: true,
      size: 'lg'
    })
  })
})
