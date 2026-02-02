import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChallengeHeaderComponent } from './challenge-header.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
import { DynamicTranslatePipe } from 'src/app/pipes/dynamic-translate.pipe';
import { provideRouter } from '@angular/router';
import { of, Subject, throwError } from "rxjs";
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum';
import { EventEmitter } from '@angular/core';
import { ChallengeService } from 'src/app/services/challenge.service';
import { AuthService } from 'src/app/services/auth.service';
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe';
import { SolutionService } from 'src/app/services/solution.service';
import { By } from '@angular/platform-browser';
import { SolutionStatus } from 'src/app/models/user-solution-status.enum';
import { CommonModalService } from 'src/app/services/common-modal.service';
import { SolutionAction } from 'src/app/models/user-solution-action.enum';
import { UserSolution } from 'src/app/models/user-solution.interface';

describe('ChallengeHeaderComponent', () => {
  let component: ChallengeHeaderComponent;
  let fixture: ComponentFixture<ChallengeHeaderComponent>;
  let modalService: NgbModal;
  let router: Router;
  let challengeService: jest.Mocked<ChallengeService>;
  let authService: jest.Mocked<AuthService>;
  let solutionService: jest.Mocked<SolutionService>;
  let mockCommonModalService: jest.Mocked<CommonModalService>;

  beforeEach(async () => {
    const mockRouter = { navigate: jest.fn() } as any;
    challengeService = {
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
      addBookmark: jest.fn(),
      removeBookmark: jest.fn(),
    } as any;
    authService = {
      isUserLoggedIn: jest.fn().mockReturnValue(true),
      getUserId: jest.fn().mockReturnValue(of('user1')),
      getUserRole: jest.fn().mockReturnValue(of('ROLE_USER')),
    } as any;
    mockCommonModalService = {
      loginRequestModal: jest.fn().mockResolvedValue({} as any)
    } as unknown as jest.Mocked<CommonModalService>;
    solutionService = {
      fetchUserSolution: jest.fn().mockReturnValue(
        of([
          {
            uuid_user: "user1",
            uuid_challenge: "testChallengeId",
            uuid_language: "testLang",
            solution_text: "some solution",
            status: SolutionStatus.ENDED,
          },
        ])
      ),
      challengeCompleted$: of("testChallengeId"),
      submitSolution: jest.fn(),

      solutionText: jest.fn(),
      updateSolutionSentState: jest.fn(),
      activeIdSubject: { next: jest.fn() },
      completeChallenge: jest.fn(),
    } as any

    await TestBed.configureTestingModule({
      declarations: [ChallengeHeaderComponent],
      imports: [I18nModule, DynamicTranslatePipe, CustomDatePipe],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: mockRouter },
        { 
          provide: ActivatedRoute, 
          useValue: { params: of({ idChallenge: 'testChallengeId' }) }
        },
        { provide: NgbModal, useValue: { open: jest.fn() } },
        { provide: ChallengeService, useValue: challengeService },
        { provide: AuthService, useValue: authService },
        { provide: SolutionService, useValue: solutionService },
        { provide: CommonModalService, useValue: mockCommonModalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeHeaderComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);
  });

  it('should create', () => { 
    expect(component).toBeTruthy();
  });

  it('should set solutionSent to true if userSolution status is ENDED', () => {
    component.idChallenge = 'testChallengeId';
    component.languageId = 'testLang';
    component.ngOnInit();
    expect(component.solutionSent).toBe(true);
  });

  it('should handle fetchUserSolution error', () => {
    solutionService.fetchUserSolution = jest.fn()
    .mockReturnValue(throwError(() => new Error('API Error')));
    component.ngOnInit();
    expect(component.solutionSent).toBe(false);
  });

  it("should set activeId to SOLUTIONS if challengeStarted is true", () => {
    component.idChallenge = "testChallengeId";
    component.challengeStarted = true;
    component.ngOnInit();
    expect(component.challengeStarted).toBe(true);
    expect(component.activeId).toBe(ChallengeTab.SOLUTIONS);
  });

  it('should log error when userId is null', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    authService.getUserId = jest.fn().mockReturnValue(of(null));
    component.ngOnInit();
    expect(consoleSpy).toHaveBeenCalledWith('Could not get User ID');
    consoleSpy.mockRestore();
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

    const timesSolvedSubject = new Subject<number>();
    const mockModalRef = {
       componentInstance: {
        idChallenge: '',
        userId: '',
        solutionAccepted: new EventEmitter<void>(),
        timesSolvedUpdated: timesSolvedSubject
     } 
    };
    jest.spyOn(modalService, 'open').mockReturnValue(mockModalRef as any);
    component.idChallenge = 'testChallengeId';
    component.openSendSolutionModal();

    expect(mockModalRef.componentInstance.idChallenge).toBe('testChallengeId');

    timesSolvedSubject.next(5)
    expect(component.timesSolved).toBe(5)
  });

  it('should start challenge', () => {
    const startChallengeSpy = jest.spyOn(component.startChallenge, 'emit');
    component.onStartChallenge();
    expect(component.challengeStarted).toBe(true);
    expect(component.solutionState).toBe(SolutionStatus.IN_PROGRESS);
    expect(component.activeId).toBe(ChallengeTab.SOLUTIONS);
    expect(startChallengeSpy).toHaveBeenCalledWith(true);
  });
  it('toggleFavorite: when not favorite should call addToFavorites and emit update', done => {
    component.idChallenge = 'ABC';
    component.favorites_count = 1;
    component.isFavorite = false;
    challengeService.addToFavorites.mockReturnValue(of({ favorite: true, timesFavorited: 2 }));
    component.favoritesUpdated.subscribe(count => {
      expect(count).toBe(2);
      expect(component.isFavorite).toBe(true);
      expect(component.favorites_count).toBe(2);
      done();
    });
    component.toggleFavorite();
  });

  it('toggleFavorite: when favorite should call removeFromFavorites', done => {
    component.idChallenge = 'ABC';
    component.favorites_count = 2;
    component.isFavorite = true;
    challengeService.removeFromFavorites.mockReturnValue(of({ favorite: false, timesFavorited: 1 }));
    component.favoritesUpdated.subscribe(count => {
      expect(count).toBe(1);
      expect(component.isFavorite).toBe(false);
      expect(component.favorites_count).toBe(1);
      done();
    });
    component.toggleFavorite();
  });

  it('toggleBookmark: add bookmark when not bookmarked', done => {
    component.idChallenge = 'B1';
    component.isBookmarked = false;
    challengeService.addBookmark.mockReturnValue(of({ bookmarked: true, timesBookmarked: 1 }));
    component.toggleBookmark(new MouseEvent('click'));
    setTimeout(() => {
      expect(component.isBookmarked).toBe(true);
      done();
    });
  });

  it('toggleBookmark: remove bookmark when bookmarked', done => {
    component.idChallenge = 'B1';
    component.isBookmarked = true;
    challengeService.removeBookmark.mockReturnValue(of({ bookmarked: false, timesBookmarked: 0 }));
    component.toggleBookmark(new MouseEvent('click'));
    setTimeout(() => {
      expect(component.isBookmarked).toBe(false);
      done();
    });
  });

  it('should log warning if fetchUserSolution fails', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    solutionService.fetchUserSolution = jest.fn().mockReturnValue(throwError(() => new Error('Test error')))
    component.ngOnInit()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user solutions:', expect.any(Error))
    consoleErrorSpy.mockRestore()
  });

  it('should set activeId to SOLUTIONS if challengeStarted is true', () => {
    component.challengeStarted = true;
    component.ngOnInit();
    expect(component.activeId).toBe(ChallengeTab.SOLUTIONS);
  });

  
  it('should NOT show "Start Challenge" button for ADMIN role', fakeAsync(() => {
  authService.getUserRole.mockReturnValue(of('ADMIN'));
  component.userRole = 'ADMIN';
  component.challengeStarted = false;
  component.ngOnInit();
  tick();
  fixture.detectChanges();
  const buttons = fixture.debugElement.queryAll(By.css('button.btn-primary'));
  const startButton = buttons.find(btn =>
    btn.nativeElement.textContent.includes('Start')
  );
  expect(startButton).toBeUndefined();
}));

  it('should handle solution accepted', () => {
    component.onSolutionAccepted();
    expect(component.solutionSent).toBe(true);
    expect(component.activeId).toBe(ChallengeTab.SOLUTIONS);
  });

  it('should call openSendSolutionModal on sendSolution', () => {
    const spy = jest.spyOn(modalService, 'open').mockReturnValue({
        componentInstance: {
            solutionAccepted: new EventEmitter<void>(),
            timesSolvedUpdated: new EventEmitter<number>()
        }
    } as any);
    component.sendSolution();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle continue challenge', () => {
    const spy = jest.spyOn(component, 'loadSolutionFromBackend');
    component.onContinueChallenge();
    expect(component.challengeStarted).toBe(true);
    expect(component.isEditorChallengeVisible).toBe(true);
    expect(component.solutionState).toBe(SolutionStatus.IN_PROGRESS);
    expect(spy).toHaveBeenCalled();
  });

  it('should load solution from backend', () => {
    solutionService.fetchUserSolution.mockReturnValue(of([
      { uuid_challenge: 'testChallengeId', uuid_language: 'testLang', solution_text: 'test solution' }
    ] as any));
    component.idChallenge = 'testChallengeId';
    component.languageId = 'testLang';
    component.loadSolutionFromBackend();
    expect(component.currentSolutionText).toBe('test solution');
  });

  it('should handle error when loading solution from backend', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    solutionService.fetchUserSolution.mockReturnValue(throwError(() => new Error('error')));
    component.loadSolutionFromBackend();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should save challenge solution', () => {
    const spy = jest.spyOn(solutionService, 'submitSolution').mockReturnValue(of({} as any));
    component.idChallenge = 'challenge1';
    component.languageId = 'lang1';
    component.solutionText = 'solution';
    component.userId = 'user1';
    component.saveChallenge();
    expect(spy).toHaveBeenCalledWith('challenge1', 'lang1', 'user1', SolutionAction.SAVE_DRAFT, 'solution');
  });

  it('should not save challenge if data is missing', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    component.idChallenge = '';
    component.saveChallenge();
    expect(consoleSpy).toHaveBeenCalledWith(' Missing data to save the solution');
  });

  it('should handle error on save challenge', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    solutionService.submitSolution.mockReturnValue(throwError(() => new Error('error')));
    component.idChallenge = 'challenge1';
    component.languageId = 'lang1';
    component.solutionText = 'solution';
    component.userId = 'user1';
    component.saveChallenge();
    expect(consoleSpy).toHaveBeenCalledWith(' Error saving solution', expect.any(Error));
  });

  it('should handle error on toggle favorite', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    challengeService.addToFavorites.mockReturnValue(throwError(() => new Error('error')));
    component.isFavorite = false;
    component.toggleFavorite();
    expect(consoleSpy).toHaveBeenCalledWith('Error adding favorite:', expect.any(Error));
  });

  it('should handle error on toggle unfavorite', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    challengeService.removeFromFavorites.mockReturnValue(throwError(() => new Error('error')));
    component.isFavorite = true;
    component.toggleFavorite();
    expect(consoleSpy).toHaveBeenCalledWith('Error removing favorite:', expect.any(Error));
  });

  it('should handle error on toggle bookmark', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    challengeService.addBookmark.mockReturnValue(throwError(() => new Error('error')));
    component.isBookmarked = false;
    component.toggleBookmark(new MouseEvent('click'));
    expect(consoleSpy).toHaveBeenCalledWith('Error adding bookmark:', expect.any(Error));
  });

  it('should handle error on toggle unbookmark', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    challengeService.removeBookmark.mockReturnValue(throwError(() => new Error('error')));
    component.isBookmarked = true;
    component.toggleBookmark(new MouseEvent('click'));
    expect(consoleSpy).toHaveBeenCalledWith('Error removing bookmark:', expect.any(Error));
  });

  it('should not toggle favorite if not logged in', () => {
    authService.isUserLoggedIn.mockReturnValue(false);
    const spy = jest.spyOn(challengeService, 'addToFavorites');
    component.toggleFavorite();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not toggle bookmark if not logged in', () => {
    authService.isUserLoggedIn.mockReturnValue(false);
    const spy = jest.spyOn(challengeService, 'addBookmark');
    component.toggleBookmark(new MouseEvent('click'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('should navigate to challenges on cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges']);
  });
  
  it('should set solutionState to NOT_STARTED if no matching solution is found', () => {
    solutionService.fetchUserSolution.mockReturnValue(of([]));
    component.loadUserSolutionStatus();
    expect(component.solutionState).toBe(SolutionStatus.NOT_STARTED);
  });
  
  it('should handle different solution statuses', () => {
    const solutions = [
      { uuid_challenge: 'testChallengeId', status: SolutionStatus.IN_PROGRESS, solution_text: 'solution', uuid_user: 'user1', uuid_language: 'lang1' },
      { uuid_challenge: 'testChallengeId', status: SolutionStatus.ENDED, solution_text: 'solution', uuid_user: 'user1', uuid_language: 'lang1' },
      { uuid_challenge: 'testChallengeId', status: SolutionStatus.SHOW_SOLUTION, solution_text: 'solution', uuid_user: 'user1', uuid_language: 'lang1' }
    ];
  
    component.idChallenge = 'testChallengeId';
    solutionService.fetchUserSolution.mockReturnValue(of([solutions[0]]));
    component.loadUserSolutionStatus();
    expect(component.solutionState).toBe(SolutionStatus.IN_PROGRESS);
  
    solutionService.fetchUserSolution.mockReturnValue(of([solutions[1]]));
    component.loadUserSolutionStatus();
    expect(component.solutionState).toBe(SolutionStatus.ENDED);

    solutionService.fetchUserSolution.mockReturnValue(of([solutions[2]]));
    component.loadUserSolutionStatus();
    expect(component.solutionState).toBe(SolutionStatus.SHOW_SOLUTION);
  });

 it("should call loginRequestModal when user is not logged in", async () => {
    mockCommonModalService.loginRequestModal = jest
      .fn()
      .mockResolvedValue({ isConfirmed: true });

    authService.isUserLoggedIn.mockReturnValue(false);
     await component.onStartChallenge();

    expect(mockCommonModalService.loginRequestModal).toHaveBeenCalled();
  })

  it("should call loginRequestModal when user is not logged in", async () => {
    mockCommonModalService.loginRequestModal = jest
      .fn()
      .mockResolvedValue({ isConfirmed: true });

    authService.isUserLoggedIn.mockReturnValue(false);

    await component.onStartChallenge();

    expect(mockCommonModalService.loginRequestModal).toHaveBeenCalled();
  })

  it("should start challenge when user is logged in", () => {
    authService.isUserLoggedIn.mockReturnValue(true);
    const startChallengeSpy = jest.spyOn(component.startChallenge, 'emit');

    component.onStartChallenge();

    expect(component.challengeStarted).toBe(true);
    expect(component.solutionState).toBe(SolutionStatus.IN_PROGRESS);
    expect(component.activeId).toBe(ChallengeTab.SOLUTIONS);
    expect(startChallengeSpy).toHaveBeenCalledWith(true);
  });

it('should open show solution modal', () => {
  const mockModalRef = {
    componentInstance: {
      idChallenge: '',
      userId: '',
      status: null,
      solutionText: '',
      mentorSolutionProvided: new EventEmitter<void>(),
    } 
  };

  jest.spyOn(modalService, 'open').mockReturnValue(mockModalRef as any);

  component.idChallenge = 'testChallengeId';
  component.userId = 'user1';
  component.solutionText = 'solution text';

  component.showSolution();

  expect(mockModalRef.componentInstance.idChallenge).toBe('testChallengeId');
  expect(mockModalRef.componentInstance.userId).toBe('user1');
  expect(mockModalRef.componentInstance.solutionText).toBe('solution text');
});

it('should set solutionSent to true and activeId to SOLUTIONS when mentorSolutionProvided is emitted', () => {
  const mockModalRef = {
    componentInstance: {
      idChallenge: '',
      userId: '',
      status: null,
      solutionText: '',
      mentorSolutionProvided: new EventEmitter<void>(),
    } 
  };

  jest.spyOn(modalService, 'open').mockReturnValue(mockModalRef as any);

  component.idChallenge = 'testChallengeId';
  component.userId = 'user1';
  component.solutionText = 'solution text';

  component.showSolution();

  expect(component.solutionSent).toBe(false);
  expect(component.activeId).not.toBe(ChallengeTab.SOLUTIONS);

  mockModalRef.componentInstance.mentorSolutionProvided.emit();

  expect(component.solutionSent).toBe(true);
  expect(component.activeId).toBe(ChallengeTab.SOLUTIONS);
});


})
