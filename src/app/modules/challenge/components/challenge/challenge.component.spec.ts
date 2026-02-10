import { SharedComponentsModule } from '../../../../shared/components/shared-components.module'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ChallengeComponent } from './challenge.component'
import { I18nModule } from '../../../../../assets/i18n/i18n.module'
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ActivatedRoute, convertToParamMap } from '@angular/router'
import { ChallengeHeaderComponent } from '../challenge-header/challenge-header.component'
import { ChallengeInfoComponent } from '../challenge-info/challenge-info.component'
import { of, throwError, BehaviorSubject } from 'rxjs'
import { ChallengeService } from '../../../../services/challenge.service'
import { By } from '@angular/platform-browser'
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'
import { SolutionComponent } from '../../../../shared/components/solution/solution.component'
import { DynamicTranslatePipe } from 'src/app/pipes/dynamic-translate.pipe'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service'
import { registerLocaleData } from '@angular/common'
import localeCa from '@angular/common/locales/ca'
import { AuthService } from 'src/app/services/auth.service'
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum';
import { SolutionService } from 'src/app/services/solution.service'


registerLocaleData(localeCa)

describe('ChallengeComponent', () => {
  let component: ChallengeComponent
  let fixture: ComponentFixture<ChallengeComponent>
  let mockChallengeService: any
  let cookieService: CookieService
  let getUserBookmarksSpy: jasmine.Spy
  let getUserFavoritesSpy: jasmine.Spy
  let mockSolutionService: any


  beforeEach(async () => {
    getUserBookmarksSpy = jasmine.createSpy('getUserBookmarks').and.returnValue(of(['id1', 'id2']))
    getUserFavoritesSpy = jasmine.createSpy('getUserFavorites').and.returnValue(of(['id3']))

    mockChallengeService = {
      getChallengeById: jasmine.createSpy('getChallengeById').and.returnValue(of({
        challenge_title: '',
        creation_date: new Date(),
        level: '',
        detail: {
          description: '',
          examples: [],
          notes: ''
        },
        related: [],
        resources: [],
        solutions: [],
        popularity: 0,
        languages: [],
        timesFavorite: 0
      })),
      getUserBookmarks: getUserBookmarksSpy,
      getUserFavorites: getUserFavoritesSpy
    }
    const activeIdSubject = new BehaviorSubject(ChallengeTab.DETAILS)
    const solutionSentSubject = new BehaviorSubject(false)
    const challengeCompletedSubject = new BehaviorSubject<string | null>(null)

    mockSolutionService = {
      activeIdSubject,
      activeId$: activeIdSubject.asObservable(),
      solutionSentSubject,
      solutionSent$: solutionSentSubject.asObservable(),
      challengeCompletedSubject,
      challengeCompleted$: challengeCompletedSubject.asObservable(),
      fetchUserSolution: jasmine.createSpy('fetchUserSolution').and.returnValue(of([])),
      solutionText: jasmine.createSpy('solutionText'),
      updateSolutionSentState: jasmine.createSpy('updateSolutionSentState'),
      sendSolution: jasmine.createSpy('sendSolution')
    }

    const mockAuthService = {
      isUserLoggedIn: () => true,
      getUserId: () => of('mock-user-id'),
      getUserRole: () => of('ROLE_USER')
    }

    await TestBed.configureTestingModule({
      declarations: [
        ChallengeComponent,
        ChallengeHeaderComponent,
        ChallengeInfoComponent,
        SolutionComponent
      ],
      imports: [
        RouterTestingModule,
        SharedComponentsModule,
        I18nModule,
        NgbNavModule,
        FormsModule,
        DynamicTranslatePipe,
        CustomDatePipe
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            paramMap: of(convertToParamMap({ idChallenge: '123' })),
            params: of({ idChallenge: '123' }), 
            url: of([]),
            snapshot: {
              queryParams: {
                tab: 'someTab'
              }
            }
          }
        },
        {
          provide: ChallengeService,
          useValue: mockChallengeService
        },
        {
    provide: SolutionService,
    useValue: mockSolutionService
  },
        { provide: AuthService, useValue: mockAuthService },
        CookieService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents()

    // Инициализация CookieService
    cookieService = TestBed.inject(CookieService)
    const mockUser = { idUser: 'testId' }
    cookieService.set('user', JSON.stringify(mockUser))
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    component.loadMasterData('123')
    component.ngOnInit()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should extract idChallenge param from the route', () => {
    expect(component.idChallenge).toBeDefined()
    expect(component.idChallenge).not.toBeNull()
    expect(component.idChallenge).not.toHaveLength(0)
    expect(component.idChallenge).not.toContain(' ')
  })

  it('should call getChallengeById when loadMasterData is called', () => {
    const challenge = {
      challenge_title: 'Test Challenge',
      creation_date: new Date(),
      level: 'Easy',
      detail: {
        description: 'Test Challenge Description',
        examples: [],
        notes: 'Test Challenge Notes'
      },
      related: [],
      resources: [],
      solutions: [],
      popularity: 0,
      languages: [],
      timesFavorite: 0
    }

    mockChallengeService.getChallengeById.and.returnValue(of(challenge))

    component.loadMasterData('123')

    expect(mockChallengeService.getChallengeById).toHaveBeenCalledWith('123')
  })

  it('should set challenge details when loadMasterData is called', () => {
    const challenge = {
      challenge_title: 'Test Challenge',
      creation_date: new Date(),
      level: 'Easy',
      detail: {
        description: 'Test Challenge Description',
        examples: [],
        notes: 'Test Challenge Notes'
      },
      related: [],
      resources: [],
      solutions: [],
      popularity: 0,
      languages: [],
      timesFavorite: 0
    }

    mockChallengeService.getChallengeById.and.returnValue(of(challenge))

    component.loadMasterData('123')

    expect(component.title).toBe('Test Challenge')
    expect(component.creation_date).toBeDefined()
    expect(component.level).toBe('Easy')
    expect(component.detail.description).toBe('Test Challenge Description')
    expect(component.detail.examples).toEqual([])
    expect(component.detail.notes).toBe('Test Challenge Notes')
    expect(component.related).toEqual([])
    expect(component.resources).toEqual([])
    expect(component.solutions).toEqual([])
    expect(component.popularity).toBe(0)
    expect(component.languages).toEqual([])
  })

  it('should pass title, creation_date, and level to ChallengeHeaderComponent', () => {
    const challenge = {
      challenge_title: 'Test Challenge',
      creation_date: new Date(),
      level: 'Easy'
    }

    mockChallengeService.getChallengeById.and.returnValue(of(challenge))

    component.loadMasterData('123')
    fixture.detectChanges()

    const challengeHeaderComponent = fixture.debugElement.query(By.directive(ChallengeHeaderComponent)).componentInstance

    expect(challengeHeaderComponent.title).toBe(component.title)
    expect(challengeHeaderComponent.creation_date).toBe(component.creation_date)
    expect(challengeHeaderComponent.level).toBe(component.level)
  })

  it('should pass challenge detail to ChallengeInfoComponent', () => {
    const challenge = {
      detail: {
        description: 'Test Challenge Description',
        examples: [],
        notes: 'Test Challenge Notes'
      },
      related: [],
      resources: [],
      solutions: [],
      popularity: 0,
      languages: [],
      timesFavorite: 0
    }

    mockChallengeService.getChallengeById.and.returnValue(of(challenge))

    component.loadMasterData('123')
    fixture.detectChanges()

    const challengeInfoComponent = fixture.debugElement.query(By.directive(ChallengeInfoComponent)).componentInstance

    expect(challengeInfoComponent.detail).toBeDefined()
    expect(challengeInfoComponent.detail.description).toBe(component.detail.description)
    expect(challengeInfoComponent.detail.examples).toEqual(component.detail.examples)
    expect(challengeInfoComponent.detail.notes).toBe(component.detail.notes)
    expect(challengeInfoComponent.popularity).toBe(component.popularity)
    expect(challengeInfoComponent.languages).toEqual(component.languages)
  })

  it('should update activeId when onActiveIdChange is called', () => {
    const newActiveId = ChallengeTab.SOLUTIONS
    component.onActiveIdChange(newActiveId)

    expect(component.activeId).toBe(newActiveId)
  })

  it('should correctly determine if a challenge is bookmarked', () => {
    component.bookmarkedChallenges = ['id-1', 'id-2']
    expect(component.isBookmarkedChallenge('id-1')).toBeTruthy()
    expect(component.isBookmarkedChallenge('id-3')).toBeFalsy()
  })

  it('should fetch and store bookmarked challenges on init', () => {
    expect(mockChallengeService.getUserBookmarks).toHaveBeenCalled()
    expect(component.bookmarkedChallenges).toEqual(['id1', 'id2'])
  })

  it('should correctly determine if a challenge is a favorite', () => {
    component.favoriteChallenges = ['id1', 'id2'];
    expect(component.isFavoriteChallenge('id1')).toBe(true);
    expect(component.isFavoriteChallenge('id3')).toBe(false);
  });

  it('should update properties on starting a challenge', () => {
    const started = true;
    component.onStartChallenge(started);
    expect(component.challengeStarted).toBe(started);
    expect(component.isEditorChallengeVisible).toBe(started);
    expect(component.solutionState).toBe(SolutionStatus.IN_PROGRESS);
  });

  it('should update favorites count', () => {
    component.challenge = { favorites_count: 5 } as any;
    component.onFavoritesUpdated(10);
    if(component.challenge) {
      expect(component.challenge.favorites_count).toBe(10);
    }
  });

  it('should handle starting a challenge', () => {
    component.onChallengeStart();
    expect(component.challengeStarted).toBe(true);
    expect(component.isEditorChallengeVisible).toBe(true);
    expect(component.isChallengeStatementVisible).toBe(false);
  });

  it('should handle continuing a challenge', () => {
    component.userSolution = { solution_text: 'some solution' } as any;
    component.onContinueChallenge();
    expect(component.challengeStarted).toBe(true);
    expect(component.isEditorChallengeVisible).toBe(true);
    expect(component.isChallengeStatementVisible).toBe(false);
    expect(component.solutionText).toBe('some solution');
  });

  it('should load solution content when idChallenge and languageId are set', () => {
    const mockSolutionService = TestBed.inject(SolutionService) as any
    ;(mockSolutionService.fetchUserSolution as jasmine.Spy).and.returnValue(of([
      { uuid_challenge: '123', uuid_language: 'lang1', solution_text: 'text' }
    ]))

    component.idChallenge = '123'
    component.languageId = 'lang1'

    component.loadSolutionContent()
    expect(mockSolutionService.fetchUserSolution).toHaveBeenCalled()
    expect(component.solutionText).toBe('text')
  })

  it('should log errors when user bookmarks/favorites loading fails', () => {
    const mockChallengeService = TestBed.inject(ChallengeService) as any
    ;(mockChallengeService.getUserBookmarks as jasmine.Spy).and.returnValue(throwError(() => new Error('fail')))
    ;(mockChallengeService.getUserFavorites as jasmine.Spy).and.returnValue(throwError(() => new Error('fail')))
    const consoleSpy = spyOn(console, 'error')

    component.loadUserBookmarks('u')
    component.loadUserFavorites('u')

    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should update solution text on editor change', () => {
    const newSolution = 'new solution text';
    component.onEditorSolutionChanged(newSolution);
    expect(component.solutionText).toBe(newSolution);
  });

  it('should NOT load user data when userId is empty', () => {
  const auth = TestBed.inject(AuthService) as any

  
  spyOn(auth, 'getUserId').and.returnValue(of(''))

  const bookmarksSpy = spyOn(component, 'loadUserBookmarks')
  const favsSpy = spyOn(component, 'loadUserFavorites')
  const statusSpy = spyOn(component, 'loadUserSolutionStatus')
  const contentSpy = spyOn(component, 'loadSolutionContent')

  component.ngOnInit()

  expect(bookmarksSpy).not.toHaveBeenCalled()
  expect(favsSpy).not.toHaveBeenCalled()
  expect(statusSpy).not.toHaveBeenCalled()
  expect(contentSpy).not.toHaveBeenCalled()
})

})
