import { type ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { SendSolutionModalComponent } from './send-solution-modal.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { SolutionService } from 'src/app/services/solution.service'
import { ChallengeService } from 'src/app/services/challenge.service'
import { AuthService } from 'src/app/services/auth.service'
import { of } from 'rxjs'

describe('SendSolutionModalComponent', () => {
  let component: SendSolutionModalComponent
  let fixture: ComponentFixture<SendSolutionModalComponent>
  let modalServiceMock: any
  let routerMock: any
  let solutionServiceMock: any;
  let challengeServiceMock: any;
  let authServiceMock: any;

  beforeEach(async () => {
    // Crear versiones simuladas de NgbModal y Router
    modalServiceMock = {
      dismissAll: jest.fn(),
      open: jest.fn()
    }

    routerMock = {
      navigateByUrl: jest.fn()
    }

    solutionServiceMock = {
      submitSolution: jest.fn().mockReturnValue(of({}))
    };

    challengeServiceMock = {
      getChallengeById: jest.fn().mockReturnValue(of({ languages: [{ id_language: 'testLanguageId' }] }))
    };

    authServiceMock = {
      getUserId: jest.fn().mockReturnValue(of('testUserId'))
    };

    await TestBed.configureTestingModule({
      declarations: [SendSolutionModalComponent],
      imports: [NgbModule, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: NgbModal, useValue: modalServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SolutionService, useValue: solutionServiceMock },
        { provide: ChallengeService, useValue: challengeServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(SendSolutionModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should receive userId as input', () => {
    component.userId = 'testUserId';
    
    expect(component.userId).toBe('testUserId');
  });

  it('should call getLanguageId and set languageId correctly', fakeAsync(() => {
    component.getLanguageId();
    tick();
    expect(challengeServiceMock.getChallengeById).toHaveBeenCalled();
    expect(component.languageId).toBe('testLanguageId');
  }));

  it('should call getSolutionText and set solutionText from localStorage', fakeAsync(() => {
    localStorage.setItem('editorContent', 'test solution text');
    component.getSolutionText();
    tick();
    expect(component.solutionText).toBe('test solution text');
  }));

  it('should call submitSolution method when acceptSolution is called', fakeAsync(() => {
    const solutionData = {
      idChallenge: 'test-challenge-id',
      languageId: 'test-language-id',
      solutionText: 'Test solution text',
      userId: 'test-user-id',
      status: 'ENDED'
    };
  
    component.idChallenge = solutionData.idChallenge;
    component.languageId = solutionData.languageId;
    component.solutionText = solutionData.solutionText;
    component.userId = solutionData.userId;
  
    solutionServiceMock.solutionText = jest.fn();
    solutionServiceMock.submitSolution = jest.fn().mockReturnValue(of({}));
    solutionServiceMock.updateSolutionSentState = jest.fn();
    solutionServiceMock.sendSolutionText = jest.fn();
    solutionServiceMock.activeIdSubject = { next: jest.fn() };
  
    component.acceptSolution();
    tick();
  
    expect(solutionServiceMock.submitSolution).toHaveBeenCalledWith(
      solutionData.idChallenge,
      solutionData.languageId,
      solutionData.userId,
      solutionData.status,
      solutionData.solutionText,
    );
  
    expect(solutionServiceMock.submitSolution).toHaveBeenCalledTimes(1);
  
    expect(solutionServiceMock.updateSolutionSentState).toHaveBeenCalledWith(true);
    expect(solutionServiceMock.sendSolutionText).toHaveBeenCalledWith(true);
    expect(solutionServiceMock.activeIdSubject.next).toHaveBeenCalledWith(2);
    expect(modalServiceMock.dismissAll).toHaveBeenCalled();
  }));

  it('should dismiss the modal when closeModal is called', () => {
    component.closeModal();
    expect(modalServiceMock.dismissAll).toHaveBeenCalled();
  });
})
