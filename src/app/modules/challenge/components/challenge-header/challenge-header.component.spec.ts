/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
import { ChallengeHeaderComponent } from './challenge-header.component';
import { SolutionService } from '../../../../services/solution.service';
import { AuthService } from "src/app/services/auth.service";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SendSolutionModalComponent } from '../../../modals/send-solution-modal/send-solution-modal.component';
import { RestrictedModalComponent } from '../../../modals/restricted-modal/restricted-modal.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';


describe('ChallengeHeaderComponent', () => {
  let component: ChallengeHeaderComponent;
  let fixture: ComponentFixture<ChallengeHeaderComponent>;
  let modalService: NgbModal;
  let authService: AuthService;
  let solutionService: SolutionService;

  beforeEach(async() => {
    const authServiceStub = {
      isUserLoggedIn: () => Promise.resolve(true)
    };
    const solutionServiceStub = {
      solutionSent$: {
        subscribe: jest.fn()
      },
      sendSolution: jest.fn()
    };
    TestBed.configureTestingModule({
      declarations: [
          ChallengeHeaderComponent
        ],
      imports: [ 
          I18nModule,
          RouterTestingModule,
          HttpClientTestingModule
        ],
      providers: [
        { provide: SolutionService, useValue: solutionServiceStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalService =TestBed.inject(NgbModal);
    authService = TestBed.inject(AuthService);
    solutionService = TestBed.inject(SolutionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize input correctly', () => {
    component.title = "Test Title",
    component.creation_date = new Date;
    component.level = "Easy",
    
    expect(component.title).toEqual("Test Title");
    expect(component.creation_date).toBeDefined();
    expect(component.level).toEqual("Easy");
  });

  it('should open send solution modal', () => {
    spyOn(modalService, 'open').and.stub();
    component.openSendSolutionModal();

    expect(modalService.open).toHaveBeenCalledWith(SendSolutionModalComponent, { centered: true, size: 'lg'});
  });


  it('should open restricted modal if user is not logged in', async () => {
    spyOn(authService, 'isUserLoggedIn').and.returnValue(Promise.resolve(false));
    spyOn(solutionServiceStub , 'sendSolution').and.stub();

    const mockModalRef = { componentInstance: {} } as NgbModalRef; // Crea un objeto NgbModalRef ficticio
    spyOn(modalService, 'open').and.returnValue(mockModalRef); // Simula que modalService.open devuelve el objeto NgbModalRef ficticio
  
    component.clickSendButton();
  
    await new Promise(resolve => setTimeout(resolve, 0)); // Espera a que todas las promesas se resuelvan
  
    expect(authService.isUserLoggedIn).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalledWith(RestrictedModalComponent, { centered: true, size: 'lg'});
  });
}); */



import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ChallengeHeaderComponent } from './challenge-header.component';
import { SolutionService } from '../../../../services/solution.service';
import { AuthService } from '../../../../services/auth.service';
import { SendSolutionModalComponent } from "./../../../modals/send-solution-modal/send-solution-modal.component";
import { RestrictedModalComponent } from 'src/app/modules/modals/restricted-modal/restricted-modal.component';

describe('ChallengeHeaderComponent', () => {
  let component: ChallengeHeaderComponent;
  let fixture: ComponentFixture<ChallengeHeaderComponent>;
  let mockModalService: any;
  let mockSolutionService: any;
  let mockAuthService: any;

  beforeEach(() => {
    mockModalService = { open: jest.fn() };
    mockSolutionService = { solutionSent$: of(false), sendSolution: jest.fn() };
    mockAuthService = { isUserLoggedIn: false };

    TestBed.configureTestingModule({
      declarations: [ChallengeHeaderComponent],
      providers: [
        { provide: NgbModal, useValue: mockModalService },
        { provide: SolutionService, useValue: mockSolutionService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    fixture = TestBed.createComponent(ChallengeHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open SendSolutionModalComponent when openSendSolutionModal is called', () => {
    component.openSendSolutionModal();
    expect(mockModalService.open).toHaveBeenCalledWith(SendSolutionModalComponent, { centered: true, size: 'lg' });
  });

  it('should open LoginModalComponent when clickSendButton is called and user is not logged in', () => {
    component.clickSendButton();
    expect(mockModalService.open).toHaveBeenCalledWith(RestrictedModalComponent, { centered: true, size: 'lg' });
  });

  it('should call sendSolution when clickSendButton is called and user is logged in', () => {
    mockAuthService.isUserLoggedIn = true;
    component.clickSendButton();
    expect(mockSolutionService.sendSolution).toHaveBeenCalledWith('');
  });
});

