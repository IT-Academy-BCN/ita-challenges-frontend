import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoginModalComponent } from './login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let modalService: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginModalComponent],
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [NgbModal],
    });

    modalService = TestBed.inject(NgbModal);
    component = TestBed.createComponent(LoginModalComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal on closeModal()', () => {
    jest.spyOn(modalService, 'dismissAll').mockImplementation();
    component.closeModal();
    expect(modalService.dismissAll).toHaveBeenCalled();
  });

  it('should open register modal on openRegisterModal()', () => {
    jest.spyOn(modalService, 'open').mockImplementation();
    component.openRegisterModal();
    expect(modalService.open).toHaveBeenCalledWith(RegisterModalComponent, { centered: true, size: 'lg' });
  });
});
