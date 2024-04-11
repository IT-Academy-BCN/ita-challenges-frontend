import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { RestrictedModalComponent } from './restricted-modal.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Router } from '@angular/router'
import { RegisterModalComponent } from '../register-modal/register-modal.component'
import { LoginModalComponent } from '../login-modal/login-modal.component'

describe('RestrictedModalComponent', () => {
  let component: RestrictedModalComponent
  let fixture: ComponentFixture<RestrictedModalComponent>
  let modalService: NgbModal
  let router: Router

  beforeEach(() => {
    // Crear versiones simuladas de NgbModal y Router
    const modalServiceMock = {
      dismissAll: jest.fn(),
      open: jest.fn()
    }

    const routerMock = {
      navigateByUrl: jest.fn()
    }

    TestBed.configureTestingModule({
      declarations: [RestrictedModalComponent],
      providers: [
        { provide: NgbModal, useValue: modalServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })

    fixture = TestBed.createComponent(RestrictedModalComponent)
    component = fixture.componentInstance
    modalService = TestBed.inject(NgbModal)
    router = TestBed.inject(Router)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should close modal when closeModal is called', () => {
    component.closeModal()
    expect(modalService.dismissAll).toHaveBeenCalled()
  })

  it('should close and open login modal when openLoginModal is called', () => {
    component.openLoginModal()
    expect(modalService.dismissAll).toHaveBeenCalled()
    expect(modalService.open).toHaveBeenCalledWith(LoginModalComponent, {
      centered: true,
      size: 'lg'
    })
  })

  it('should close and open register modal when openRegisterModal is called', () => {
    component.openRegisterModal()
    expect(modalService.dismissAll).toHaveBeenCalled()
    expect(modalService.open).toHaveBeenCalledWith(RegisterModalComponent, {
      centered: true,
      size: 'lg'
    })
  })
})
