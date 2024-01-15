import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { RestrictedModalComponent } from './restricted-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';

describe('RestrictedModalComponent', () => {
  let component: RestrictedModalComponent;
  let modalService: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestrictedModalComponent],
      imports: [TranslateModule.forRoot()],
      providers: [NgbModal],
    });

    modalService = TestBed.inject(NgbModal);
    component = TestBed.createComponent(RestrictedModalComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal on closeModal()', () => {
    jest.spyOn(modalService, 'dismissAll').mockImplementation();
    component.closeModal();
    expect(modalService.dismissAll).toHaveBeenCalled();
  });

  it('should open login modal on openLoginModal()', () => {
    jest.spyOn(modalService, 'open').mockImplementation();
    component.openLoginModal();
    expect(modalService.open).toHaveBeenCalledWith(LoginModalComponent, { centered: true, size: 'lg' });
  });

  it('should open register modal on openRegisterModal()', () => {
    jest.spyOn(modalService, 'open').mockImplementation();
    component.openRegisterModal();
    expect(modalService.open).toHaveBeenCalledWith(RegisterModalComponent, { centered: true, size: 'lg' });
  });
});
