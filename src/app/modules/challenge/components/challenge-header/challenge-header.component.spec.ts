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

