import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;
  let mockModalService: any;
  
  beforeEach(async () => {
    mockModalService = { dismissAll: jasmine.createSpy('dismissAll'), open: jasmine.createSpy('open')};

    await TestBed.configureTestingModule({
      declarations: [ LoginModalComponent ],
      providers: [
        { provide: NgbModal, useValue: mockModalService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dismissAll when closeModal is called', () => {
    component.closeModal();
    expect(mockModalService.dismissAll.calls.count()).toBe(1);
  });

  it('should open the register modal when openRegisterModal is called', () => {
    component.openRegisterModal();
    expect(mockModalService.dismissAll.calls.count()).toBe(1);
    expect(mockModalService.open.calls.count()).toBe(1);
    expect(mockModalService.open.calls.mostRecent().args[0]).toBe(RegisterModalComponent);
  });
});
