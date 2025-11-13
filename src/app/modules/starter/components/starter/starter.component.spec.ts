import { SolutionStatus } from 'src/app/models/user-solution-status.enum';
import { TestBed, type ComponentFixture } from '@angular/core/testing'

import { StarterComponent } from './starter.component'
import { StarterService } from 'src/app/services/starter.service'
import { TranslateModule } from '@ngx-translate/core'
import { type Challenge } from 'src/app/models/challenge.model'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { of, BehaviorSubject, throwError } from 'rxjs'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import mockChallenges from 'src/mocks/challenge/challenge.mock.json'
import { AuthService } from 'src/app/services/auth.service';
import { ChallengeService } from 'src/app/services/challenge.service';
import { SolutionService } from 'src/app/services/solution.service';
import { type UserSolution } from 'src/app/models/user-solution.interface';

describe('StarterComponent', () => {
  it('should re-fetch challenges when refresh$ emits', () => {
    const fixture = TestBed.createComponent(StarterComponent);
    const component = fixture.componentInstance;
    const starterService = TestBed.inject(StarterService);
    fixture.detectChanges();

    spyOn(component, 'getChallenge');
    starterService.invalidateCacheAndRefresh();

    expect(component.getChallenge).toHaveBeenCalled();
  });
  let component: StarterComponent
  let fixture: ComponentFixture<StarterComponent>
  let starterService: StarterService
  let authService: AuthService;
  let solutionService: SolutionService;
  let authRoleSubject: BehaviorSubject<string>;
  let getUserBookmarksSpy: jasmine.Spy;
  let getUserFavoritesSpy: jasmine.Spy;
  let fetchUserSolutionSpy: jasmine.Spy;

  const mockChallenges$: Challenge[] = mockChallenges.map((challenge: any) => ({
    ...challenge,
    creation_date: new Date(`${challenge.creation_date}`),
    timesFavorite: typeof challenge.timesFavorite === 'number' ? challenge.timesFavorite : 0,
    solutions: challenge.solutions.map((solution: any) => ({
      id_solution: solution.idSolution,
      solution_text: solution.solutionText
    }))
  }))

  beforeEach(() => {
    // Create a mock AuthService with a BehaviorSubject we can control
    authRoleSubject = new BehaviorSubject<string>('')
    const authServiceMock = {
      getUserRole: () => authRoleSubject.asObservable(),
      updateUserRoleAndUserNameFromToken: () => {},
      isUserLoggedIn: () => true,
      getUserId: () => of('mock-user-id')
    }
    getUserBookmarksSpy = jasmine.createSpy().and.returnValue(of(['id-1', 'id-2']))
    getUserFavoritesSpy = jasmine.createSpy().and.returnValue(of([]))

    const challengeServiceMock = {
      getUserBookmarks: getUserBookmarksSpy,
      getUserFavorites: getUserFavoritesSpy
    };

    fetchUserSolutionSpy = jasmine.createSpy().and.returnValue(of([]));
    const solutionServiceMock = {
      fetchUserSolution: fetchUserSolutionSpy
    };

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

    component.listChallenges = [];
    component.filters = { languages: [], levels: [], progress: [] }
    component.sortBy = ''
  })

  it('should assign all challenges when listChallenges is populated.', () => {
    component.listChallenges = mockChallenges$
    component.filters = { languages: [], levels: [], progress: [] }
    component.getChallengeFilters(component.filters)
    expect(component.challenges.length).toBe(mockChallenges$.length) // Debe mostrar 3 desafíos
    expect(component.challenges).toEqual(mockChallenges$) // Verifica que los desafíos sean correctos
  })

  it('should filter challenges and update challenges correctly', () => {
    // Simular la lista de desafíos
    component.listChallenges = mockChallenges$

    const filters = { languages: ['es'], levels: ['EASY'], progress: [] }
    const filteredChallenges = mockChallenges$.slice(0, 3)

    // Simular el servicio para que devuelva desafíos filtrados
    spyOn(starterService, 'getAllChallengesFiltered').and.returnValue(of(filteredChallenges)) // Solo retorna los primeros

    component.getChallengeFilters(filters)

    expect(component.filters).toEqual(filters) // Verifica que los filtros se hayan establecido correctamente
    expect(starterService.getAllChallengesFiltered).toHaveBeenCalledWith(filters, mockChallenges$) // Verifica que el método se haya llamado con los argumentos correctos
    expect(component.challenges).toEqual(filteredChallenges)
  })

  it('should change the sorting criterion and update isAscending and selectedSort correctly.', () => {
    component.selectedSort = 'creation_date'
    component.isAscending = false
    spyOn(component, 'refreshChallengeList')

    // Cambia a un nuevo criterio de ordenación que no sea el actual
    component.changeSort('popularity')

    expect(component.selectedSort).toBe('popularity')
    expect(component.isAscending).toBe(false)
    expect(component.refreshChallengeList).toHaveBeenCalled()

    // Cambia de nuevo al criterio de ordenación actual para verificar el cambio en isAscending
    component.changeSort('popularity')
    expect(component.isAscending).toBe(true)
    expect(component.refreshChallengeList).toHaveBeenCalledTimes(2)
  })

  it('should update isAdmin flag when user role changes to ADMIN', () => {
    expect(component.isAdmin).toBe(false)

    authRoleSubject.next('ADMIN')
    expect(component.isAdmin).toBe(true)
  })

  it('should update isAdmin flag when user role changes to non-ADMIN', () => {
    authRoleSubject.next('ADMIN')
    expect(component.isAdmin).toBe(true)

    authRoleSubject.next('USER')

    expect(component.isAdmin).toBe(false)
  })

  it('should unsubscribe from userRoleSubs$ on component destruction', () => {
    spyOn(component.userRoleSubs$, 'unsubscribe')

    // Trigger the component's ngOnDestroy lifecycle hook to clean up subscriptions
    component.ngOnDestroy()

    expect(component.userRoleSubs$.unsubscribe).toHaveBeenCalled()
  })
  it('should correctly determine if a challenge is bookmarked', () => {
    component.bookmarkedChallenges = ['id-1', 'id-2']
    expect(component.isBookmarkedChallenge('id-1')).toBeTruthy()
    expect(component.isBookmarkedChallenge('id-3')).toBeFalsy()
  })
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
