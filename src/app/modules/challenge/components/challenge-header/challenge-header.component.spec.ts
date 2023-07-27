import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
import { ChallengeHeaderComponent } from './challenge-header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendSolutionModalComponent } from '../../../modals/send-solution-modal/send-solution-modal.component';
import { RestrictedModalComponent } from '../../../modals/restricted-modal/restricted-modal.component';
import { SendSolutionService } from '../../../../services/send-solution.service';
import { SolutionComponent } from '../../../../shared/components/solution/solution.component';

describe('ChallengeHeaderComponent', () => {
  let component: ChallengeHeaderComponent;
  let fixture: ComponentFixture<ChallengeHeaderComponent>;
  let modalService: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChallengeHeaderComponent,
        SolutionComponent],
      imports: [
          I18nModule,
          RouterTestingModule,
          HttpClientTestingModule 
        ],
      providers: [
        NgbModal,
        SendSolutionService
     ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalService =TestBed.inject(NgbModal);
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

  it('should open restricted modal if', () => {
    spyOn(modalService, 'open').and.stub();
    component.userLoggedIn = false;
    component.clickSendButton();

  expect(modalService.open).toHaveBeenCalledWith(RestrictedModalComponent, { centered: true, size: 'lg'});
  });

});
