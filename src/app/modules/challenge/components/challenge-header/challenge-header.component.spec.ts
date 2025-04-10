import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeHeaderComponent } from './challenge-header.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
import { DynamicTranslatePipe } from 'src/app/pipes/dynamic-translate.pipe';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum';

describe('ChallengeHeaderComponent', () => {
  let component: ChallengeHeaderComponent;
  let fixture: ComponentFixture<ChallengeHeaderComponent>;
  let modalService: NgbModal;
  let router: Router;

  beforeEach(async () => {
    const mockRouter = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [ChallengeHeaderComponent],
      imports: [I18nModule, DynamicTranslatePipe],
      providers: [
        NgbModal,
        provideRouter([]),
        { provide: Router, useValue: mockRouter },
        { provide: NgbModal, useValue: { open: jest.fn() } },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            params: of({ idChallenge: 'testChallengeId' }), 
            snapshot: { params: { idChallenge: 'testChallengeId' } } 
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeHeaderComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges(); 
    expect(component).toBeTruthy();
  });

  it('should initialize input correctly', () => {
    component.title = 'Test Title';
    component.creation_date = new Date();
    component.level = 'Easy';
    component.activeId = ChallengeTab.DETAILS;

    expect(component.title).toEqual('Test Title');
    expect(component.creation_date).toBeDefined();
    expect(component.level).toEqual('Easy');
    expect(component.activeId).toEqual(ChallengeTab.DETAILS);
  });

  it('should open send solution modal', () => {
    const mockModalRef = { componentInstance: { idChallenge: '' } };
    jest.spyOn(modalService, 'open').mockReturnValue(mockModalRef as any);
    component.idChallenge = 'testChallengeId';
    component.openSendSolutionModal();

    expect(mockModalRef.componentInstance.idChallenge).toBe('testChallengeId');
  });

  it('should start challenge and navigate', async () => {
    component.idChallenge = '123';
    await component.onStartChallenge();

    expect(component.challengeStarted).toBe(true);
    expect(component.activeId).toBe(ChallengeTab.SOLUTIONS);
    expect(localStorage.getItem('challengeStarted')).toContain('123');
    expect(router.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges/123/start']);
  });

  it('should navigate to edit challenge page when clicking the edit button', () => {
    component.idChallenge = '1234'
    component.navigateToEditChallenge()
    expect(router.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges/1234/edit'])
  })
  
});
