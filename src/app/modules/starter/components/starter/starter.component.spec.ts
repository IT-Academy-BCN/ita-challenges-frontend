import { SolutionStatus } from 'src/app/models/user-solution-status.enum';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { StarterComponent } from './starter.component';
import { StarterService } from 'src/app/services/starter.service';
import { TranslateModule } from '@ngx-translate/core';
import { type Challenge } from 'src/app/models/challenge.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, BehaviorSubject, throwError, Subject } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import mockChallenges from 'src/mocks/challenge/challenge.mock.json';
import { AuthService } from 'src/app/services/auth.service';
import { ChallengeService } from 'src/app/services/challenge.service';
import { SolutionService } from 'src/app/services/solution.service';
import { type UserSolution } from 'src/app/models/user-solution.interface';

describe('StarterComponent', () => {
  it('should render filters visible by default and without a toggle button', () => {
    const fixture = TestBed.createComponent(StarterComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('#filters-toggle');
    const panel: HTMLElement | null = fixture.nativeElement.querySelector('#filters-panel');
    expect(button).toBeNull();
    expect(panel).toBeTruthy();
    expect(panel?.classList.contains('open')).toBe(true);
  });

  it('should have the filters panel present in the DOM', () => {
    const fixture = TestBed.createComponent(StarterComponent);
    fixture.detectChanges();
    const panel: HTMLElement | null = fixture.nativeElement.querySelector('#filters-panel');
    expect(panel).toBeTruthy();
    expect(panel?.classList.contains('open')).toBe(true);
  });

  it('should re-fetch challenges when refresh$ emits', () => {
    const fixture = TestBed.createComponent(StarterComponent);
    const component = fixture.componentInstance;
    const starterService = TestBed.inject(StarterService);
    fixture.detectChanges();

    spyOn(component, 'getChallenge');
    starterService.invalidateCacheAndRefresh();

    expect(component.getChallenge).toHaveBeenCalled();
  });

  let component: StarterComponent;
  let fixture: ComponentFixture<StarterComponent>;
  let starterService: StarterService;
  let authService: AuthService;
  let solutionService: SolutionService;
  let authRoleSubject: BehaviorSubject<string>;
  let getUserBookmarksSpy: jasmine.Spy;
  let getUserFavoritesSpy: jasmine.Spy;
  let fetchUserSolutionSpy: jasmine.Spy;
  let invalidate$: Subject<void>;

  const mockChallenges$: Challenge[] = mockChallenges.map((challenge: any) => ({
    ...challenge,
    creation_date: new Date(`${challenge.creation_date}`),
    timesFavorite: typeof challenge.timesFavorite === 'number' ? challenge.timesFavorite : 0,
    solutions: challenge.solutions.map((solution: any) => ({
      id_solution: solution.idSolution,
      solution_text: solution.solutionText
    }))
  }));

  beforeEach(() => {
    // Subject for the list invalidation observable consumed by the component
    invalidate$ = new Subject<void>();

    // Auth mock with role stream we can control
    authRoleSubject = new BehaviorSubject<string>('');
    const authServiceMock = {
      getUserRole: () => authRoleSubject.asObservable(),
      updateUserRoleAndUserNameFromToken: () => {},
      isUserLoggedIn: () => true,
      getUserId: () => of('mock-user-id')
    };

    // ChallengeService mocks
    getUserBookmarksSpy = jasmine.createSpy().and.returnValue(of(['id-1', 'id-2']));
    getUserFavoritesSpy = jasmine.createSpy().and.returnValue(of([]));

    const challengeServiceMock = {
      // ✅ Must exist because StarterComponent subscribes to it in ngOnInit
      invalidateList$: invalidate$.asObservable(),
      getUserBookmarks: getUserBookmarksSpy,
      getUserFavorites: getUserFavoritesSpy
    };

    // SolutionService mock
    fetchUserSolutionSpy = jasmine.createSpy().and.returnValue(of([]));
    const solutionServiceMock = { fetchUserSolution: fetchUserSolutionSpy };

    TestBed.configureTestingModule({
      declarations: [StarterComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        StarterService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: ChallengeService, useValue: challengeServiceMock },
        { provide: SolutionService, useValue: solutionServiceMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    fixture = TestBed.createComponent(StarterComponent);
    component = fixture.componentInstance;
    starterService = TestBed.inject(StarterService);
    authService = TestBed.inject(AuthService);
    solutionService = TestBed.inject(SolutionService);
    fixture.detectChanges();

    // Default state for tests that directly call filtering methods
    component.listChallenges = [];
    component.filters = { languages: [], levels: [], progress: [] };
    component.sortBy = '';
  });

  it('should assign all challenges when listChallenges is populated.', () => {
    component.listChallenges = mockChallenges$;
    component.filters = { languages: [], levels: [], progress: [] };
    component.getChallengeFilters(component.filters);
    expect(component.challenges.length).toBe(mockChallenges$.length);
    expect(component.challenges).toEqual(mockChallenges$);
  });

  it('should filter challenges and update challenges correctly', () => {
    component.listChallenges = mockChallenges$;

    const filters = { languages: ['es'], levels: ['EASY'], progress: [] };
    const filteredChallenges = mockChallenges$.slice(0, 3);

    spyOn(starterService, 'getAllChallengesFiltered').and.returnValue(of(filteredChallenges));

    component.getChallengeFilters(filters);

    expect(component.filters).toEqual(filters);
    expect(starterService.getAllChallengesFiltered).toHaveBeenCalledWith(filters, mockChallenges$);
    expect(component.challenges).toEqual(filteredChallenges);
  });

  it('should change the sorting criterion and update isAscending and selectedSort correctly.', () => {
    component.selectedSort = 'creation_date';
    component.isAscending = false;
    spyOn(component, 'refreshChallengeList');

    component.changeSort('popularity');

    expect(component.selectedSort).toBe('popularity');
    expect(component.isAscending).toBe(false);
    expect(component.refreshChallengeList).toHaveBeenCalled();

    component.changeSort('popularity');
    expect(component.isAscending).toBe(true);
    expect(component.refreshChallengeList).toHaveBeenCalledTimes(2);
  });

  it('should update isAdmin flag when user role changes to ADMIN', () => {
    expect(component.isAdmin).toBe(false);
    authRoleSubject.next('ADMIN');
    expect(component.isAdmin).toBe(true);
  });

  it('should update isAdmin flag when user role changes to non-ADMIN', () => {
    authRoleSubject.next('ADMIN');
    expect(component.isAdmin).toBe(true);
    authRoleSubject.next('USER');
    expect(component.isAdmin).toBe(false);
  });

  it('should unsubscribe from userRoleSubs$ on component destruction', () => {
    spyOn(component.userRoleSubs$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.userRoleSubs$.unsubscribe).toHaveBeenCalled();
  });

  it('should correctly determine if a challenge is bookmarked', () => {
    component.bookmarkedChallenges = ['id-1', 'id-2'];
    expect(component.isBookmarkedChallenge('id-1')).toBeTruthy();
    expect(component.isBookmarkedChallenge('id-3')).toBeFalsy();
  });

  it('should fetch and store bookmarks on init', () => {
    expect(getUserBookmarksSpy).toHaveBeenCalled();
    expect(component.bookmarkedChallenges).toEqual(['id-1', 'id-2']);
  });

  it('should call fetchUserSolutionsStatus on init if user is not admin', () => {
    authRoleSubject.next('USER');
    fixture.detectChanges();
    expect(fetchUserSolutionSpy).toHaveBeenCalled();
  });

  it('should not call fetchUserSolutionsStatus on init if user is admin', () => {
    fetchUserSolutionSpy.calls.reset();
    authRoleSubject.next('ADMIN');
    fixture.detectChanges();
    expect(fetchUserSolutionSpy).not.toHaveBeenCalled();
  });

  it('should correctly map user solutions to solutionStatusMap', () => {
    const mockSolutions: UserSolution[] = [
      { uuid_user: 'user-1', uuid_challenge: 'challenge-1', uuid_language: 'lang-1', solution_text: 'sol-1', status: SolutionStatus.IN_PROGRESS },
      { uuid_user: 'user-1', uuid_challenge: 'challenge-2', uuid_language: 'lang-1', solution_text: 'sol-2', status: SolutionStatus.ENDED }
    ];
    fetchUserSolutionSpy.and.returnValue(of(mockSolutions));

    component.fetchUserSolutionsStatus();

    expect(component.solutionStatusMap['challenge-1']).toBe(SolutionStatus.IN_PROGRESS);
    expect(component.solutionStatusMap['challenge-2']).toBe(SolutionStatus.ENDED);
  });

  it('should handle error when fetching user solutions', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    fetchUserSolutionSpy.and.returnValue(throwError(() => new Error('Error fetching solutions')));
    component.fetchUserSolutionsStatus();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user solutions:', jasmine.any(Error));
  });
});

describe('Progress filtering behavior', () => {
  let component: StarterComponent;
  let fixture: ComponentFixture<StarterComponent>;
  let starterService: StarterService;
  let authRoleSubject: BehaviorSubject<string>;
  let fetchUserSolutionSpy: jasmine.Spy;
  let invalidate$: Subject<void>;

  beforeEach(() => {
    // Subject for invalidateList$ used by the component
    invalidate$ = new Subject<void>();

    authRoleSubject = new BehaviorSubject<string>('USER');
    const authServiceMock = {
      getUserRole: () => authRoleSubject.asObservable(),
      updateUserRoleAndUserNameFromToken: () => {},
      isUserLoggedIn: () => true,
      getUserId: () => of('mock-user-id')
    };

    const challengeServiceMock = {
      invalidateList$: invalidate$.asObservable(),
      getUserBookmarks: jasmine.createSpy().and.returnValue(of([])),
      getUserFavorites: jasmine.createSpy().and.returnValue(of([]))
    };

    fetchUserSolutionSpy = jasmine.createSpy().and.returnValue(of([]));
    const solutionServiceMock = { fetchUserSolution: fetchUserSolutionSpy };

    TestBed.configureTestingModule({
      declarations: [StarterComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        StarterService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: ChallengeService, useValue: challengeServiceMock },
        { provide: SolutionService, useValue: solutionServiceMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    fixture = TestBed.createComponent(StarterComponent);
    component = fixture.componentInstance;
    starterService = TestBed.inject(StarterService);
    fixture.detectChanges();
  });

  it('should filter challenges by progress using solutionStatusMap', () => {
    const ch1: any = { id_challenge: 'c1', creation_date: new Date(), timesFavorite: 0, solutions: [], languages: [], level: 'EASY' };
    const ch2: any = { id_challenge: 'c2', creation_date: new Date(), timesFavorite: 0, solutions: [], languages: [], level: 'EASY' };
    const ch3: any = { id_challenge: 'c3', creation_date: new Date(), timesFavorite: 0, solutions: [], languages: [], level: 'EASY' };

    component.listChallenges = [ch1, ch2, ch3];

    spyOn(starterService, 'getAllChallengesFiltered').and.returnValue(of([ch1, ch2, ch3]));

    component.solutionStatusMap = {
      c1: SolutionStatus.NOT_STARTED,
      c2: SolutionStatus.IN_PROGRESS,
      c3: SolutionStatus.ENDED
    } as any;

    component.getChallengeFilters({ languages: [], levels: [], progress: [SolutionStatus.NOT_STARTED] });
    expect(component.challenges.map((c: any) => c.id_challenge)).toEqual(['c1']);

    component.getChallengeFilters({ languages: [], levels: [], progress: [SolutionStatus.IN_PROGRESS] });
    expect(component.challenges.map((c: any) => c.id_challenge)).toEqual(['c2']);

    component.getChallengeFilters({ languages: [], levels: [], progress: [SolutionStatus.ENDED] });
    expect(component.challenges.map((c: any) => c.id_challenge)).toEqual(['c3']);

    component.getChallengeFilters({ languages: [], levels: [], progress: [SolutionStatus.NOT_STARTED, SolutionStatus.ENDED] });
    expect(
      component.challenges.map((c: any) => c.id_challenge).sort((a: string, b: string) => a.localeCompare(b))
    ).toEqual(['c1', 'c3']);
  });
});
