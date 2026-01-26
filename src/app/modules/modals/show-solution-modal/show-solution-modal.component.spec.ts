import { type ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { ShowSolutionModalComponent } from './show-solution-modal.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { SolutionService } from 'src/app/services/solution.service'
import { ChallengeService } from 'src/app/services/challenge.service'
import { AuthService } from 'src/app/services/auth.service'
import { of } from 'rxjs'
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'
import { SolutionAction } from 'src/app/models/user-solution-action.enum'

describe('ShowSolutionModalComponent', () => {
  let component: ShowSolutionModalComponent
  let fixture: ComponentFixture<ShowSolutionModalComponent>
  let modalServiceMock: any
  let routerMock: any
  let solutionServiceMock: any;
  let challengeServiceMock: any;
  let authServiceMock: any;

  beforeEach(async () => {
    modalServiceMock = {
      dismissAll: jest.fn(),
      open: jest.fn()
    }

    routerMock = {
      navigateByUrl: jest.fn()
    }

    solutionServiceMock = {
      submitSolution: jest.fn().mockReturnValue(of({})),
      solutionText: jest.fn(),
      updateSolutionSentState: jest.fn(),
      activeIdSubject: { next: jest.fn() },
      completeChallenge: jest.fn()
    };

    challengeServiceMock = {
      getChallengeById: jest.fn().mockReturnValue(of({ languages: [{ id_language: 'testLanguageId' }] }))
    };

    authServiceMock = {
      getUserId: jest.fn().mockReturnValue(of('testUserId'))
    };

    await TestBed.configureTestingModule({
      declarations: [ShowSolutionModalComponent],
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

    fixture = TestBed.createComponent(ShowSolutionModalComponent)
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
  
  it('should call submitSolution method when mentorSolutionShowed is called', fakeAsync(() => {
    const solutionData = {
      idChallenge: 'test-challenge-id',
      languageId: 'test-language-id',
      solutionText: 'Test solution text',
      userId: 'test-user-id',
      action: SolutionAction.SEE_SOLUTION
    };
  
    component.idChallenge = solutionData.idChallenge;
    component.languageId = solutionData.languageId;
    component.solutionText = solutionData.solutionText;
    component.userId = solutionData.userId;
  
    solutionServiceMock.solutionText = jest.fn();
    solutionServiceMock.submitSolution = jest.fn().mockReturnValue(of({}));
    solutionServiceMock.updateSolutionSentState = jest.fn();
    solutionServiceMock.activeIdSubject = { next: jest.fn() };
  
    component.mentorSolutionShowed();
    tick();
  
    expect(solutionServiceMock.submitSolution).toHaveBeenCalledWith(
      solutionData.idChallenge,
      solutionData.languageId,
      solutionData.userId,
      SolutionAction.SEE_SOLUTION,
      solutionData.solutionText,
    );
  
    expect(solutionServiceMock.submitSolution).toHaveBeenCalledTimes(1);
  
    expect(solutionServiceMock.updateSolutionSentState).toHaveBeenCalledWith(true);
    expect(solutionServiceMock.activeIdSubject.next).toHaveBeenCalledWith(ChallengeTab.SOLUTIONS);
    expect(solutionServiceMock.completeChallenge).toHaveBeenCalledWith(solutionData.idChallenge);
    expect(modalServiceMock.dismissAll).toHaveBeenCalled();
  }));

  it('should dismiss the modal when closeModal is called', () => {
    component.closeModal();
    expect(modalServiceMock.dismissAll).toHaveBeenCalled();
  });
  it('should handle error when showSolution fails', fakeAsync(() => {
  const solutionData = {
    idChallenge: 'test-challenge-id',
    languageId: 'test-language-id',
    solutionText: 'Test solution text',
    userId: 'test-user-id',
    status: 'GIVE_UP'
  };

  component.idChallenge = solutionData.idChallenge;
  component.languageId = solutionData.languageId;
  component.solutionText = solutionData.solutionText;
  component.userId = solutionData.userId;

  const error = new Error('Failed to show solution');
  solutionServiceMock.submitSolution = jest.fn().mockReturnValue(
    require('rxjs').throwError(() => error)
  );
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  component.mentorSolutionShowed();
  tick();

  expect(solutionServiceMock.submitSolution).toHaveBeenCalled();
  expect(consoleSpy).toHaveBeenCalledWith('Error showing solution:', error);
  expect(solutionServiceMock.updateSolutionSentState).not.toHaveBeenCalled();
  expect(modalServiceMock.dismissAll).not.toHaveBeenCalled();

  consoleSpy.mockRestore();
}));

it('should emit mentorSolutionProvided when mentorSolutionShowed succeeds', fakeAsync(() => {
  const emitSpy = jest.spyOn(component.mentorSolutionProvided, 'emit');
  component.languageId = 'test-language-id';
  component.mentorSolutionShowed();
  tick();
  expect(emitSpy).toHaveBeenCalledWith(true);
}));

})
