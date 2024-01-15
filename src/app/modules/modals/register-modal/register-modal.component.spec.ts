import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterModalComponent } from './register-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let modalService: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterModalComponent],
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [NgbModal],
    });

    modalService = TestBed.inject(NgbModal);
    component = TestBed.createComponent(RegisterModalComponent).componentInstance;
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
});
