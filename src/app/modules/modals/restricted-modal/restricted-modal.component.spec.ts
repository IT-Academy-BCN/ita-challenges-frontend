import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RestrictedModalComponent } from './restricted-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';

describe('RestrictedModalComponent', () => {
  let component: RestrictedModalComponent;
  let fixture: ComponentFixture<RestrictedModalComponent>;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbModule],
      declarations: [RestrictedModalComponent],
      providers: [NgbModal]
    }).compileComponents();

    modalService = TestBed.inject(NgbModal);
    fixture = TestBed.createComponent(RestrictedModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should open login modal', () => {
  spyOn(modalService, 'dismissAll');
  spyOn(modalService, 'open');

  fixture.detectChanges();

  const openLoginButton = fixture.debugElement.query(By.css('[data-testid="openLogin"]'));
  openLoginButton.triggerEventHandler('click', null);

  expect(modalService.dismissAll).toHaveBeenCalled();
  expect(modalService.open).toHaveBeenCalledWith(LoginModalComponent, { centered : true, size : 'lg' });
});

it('should open register modal', () => {
  spyOn(modalService, 'dismissAll');
  spyOn(modalService, 'open');

  fixture.detectChanges();

  const openRegisterButton = fixture.debugElement.query(By.css('[data-testid="openRegister"]'));
  openRegisterButton.triggerEventHandler('click', null);

  expect(modalService.dismissAll).toHaveBeenCalled();
  expect(modalService.open).toHaveBeenCalledWith(RegisterModalComponent, { centered : true, size : 'lg' });
});

  it('should close modal', () => {
    spyOn(modalService, 'dismissAll').and.callThrough();

    fixture.detectChanges();

    const closeModalButton = fixture.debugElement.query(By.css('[data-testid="closeModal"]')).nativeElement;
    closeModalButton.click();

    expect(modalService.dismissAll).toHaveBeenCalled();
  });
});
