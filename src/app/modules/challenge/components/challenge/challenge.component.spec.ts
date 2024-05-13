import { SharedComponentsModule } from '../../../../shared/components/shared-components.module'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ChallengeComponent } from './challenge.component'
import { I18nModule } from '../../../../../assets/i18n/i18n.module'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ActivatedRoute, convertToParamMap } from '@angular/router'
import { ChallengeHeaderComponent } from '../challenge-header/challenge-header.component'
import { ChallengeInfoComponent } from '../challenge-info/challenge-info.component'
import { of } from 'rxjs'
import { ChallengeService } from '../../../../services/challenge.service'
import { By } from '@angular/platform-browser'
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'
import { SolutionComponent } from '../../../../shared/components/solution/solution.component'
import { AuthService } from 'src/app/services/auth.service'

describe('ChallengeComponent', () => {
  let component: ChallengeComponent
  let fixture: ComponentFixture<ChallengeComponent>
  let mockChallengeService: any

  beforeEach(async () => {
    mockChallengeService = {
      getChallengeById: jasmine.createSpy('getChallengeById').and.returnValue(of({}))
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
        HttpClientTestingModule,
        SharedComponentsModule,
        I18nModule,
        NgbNavModule,
        FormsModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            paramMap: of(convertToParamMap({ idChallenge: '123' })),
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
        AuthService
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should create and get idChallenge param', () => {
    expect(component).toBeTruthy()
    expect(component.idChallenge).not.toBeNull()
    expect(component.idChallenge).not.toBeUndefined()
    expect(component.idChallenge).not.toHaveLength(0)
    expect(component.idChallenge).not.toContain(' ')
  })

  it('should call getChallengeById when loadMasterdata is called', () => {
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
      languages: []
    }
    mockChallengeService.getChallengeById.and.returnValue(of(challenge))

    component.loadMasterData('123')

    expect(mockChallengeService.getChallengeById).toHaveBeenCalledWith('123')
  })

  it('should set challenge details when loadMasterdata is called', () => {
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
      languages: []
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

  it('should pass the input property value to the child  header component', () => {
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

  it('should pass the input property value to the child  info component', () => {
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
      languages: []
    }
    mockChallengeService.getChallengeById.and.returnValue(of(challenge))

    component.loadMasterData('123')

    fixture.detectChanges()

    const challengeInfoComponent = fixture.debugElement.query(By.directive(ChallengeInfoComponent)).componentInstance

    expect(challengeInfoComponent.detail).toBeDefined()
    expect(challengeInfoComponent.detail.description).toBe(component.detail.description)
    expect(challengeInfoComponent.detail.examples).toEqual(component.detail.examples)
    expect(challengeInfoComponent.detail.notes).toBe(component.detail.notes)
    expect(challengeInfoComponent.related).toEqual(component.related)
    expect(challengeInfoComponent.resources).toEqual(component.resources)
    expect(challengeInfoComponent.solutions).toEqual(component.solutions)
    expect(challengeInfoComponent.popularity).toBe(component.popularity)
    expect(challengeInfoComponent.languages).toEqual(component.languages)
  })

  it('should onActiveIdchange correctly', () => {
    const newActiveId = 2
    component.onActiveIdChange(newActiveId)

    expect(component.activeId).toBe(newActiveId)
  })
})
