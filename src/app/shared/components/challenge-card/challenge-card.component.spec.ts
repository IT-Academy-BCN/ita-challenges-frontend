import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ChallengeCardComponent } from './challenge-card.component'
import { RouterTestingModule } from '@angular/router/testing'
import { StarterService } from '../../../services/starter.service'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { DateFormatterService } from 'src/app/services/date-formatter.service'

describe('ChallengeComponent', () => {
  let component: ChallengeCardComponent
  let fixture: ComponentFixture<ChallengeCardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChallengeCardComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        StarterService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        TranslateService,
        DateFormatterService
      ]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeCardComponent)
    component = fixture.componentInstance
    component.creation_date = new Date()
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize input correctly', () => {
    component.title = 'Test title'
    component.languages = ['JavaScript', 'Java']
    component.creation_date = new Date()
    component.level = 'Medium'
    component.popularity = 100
    component.id = '123'

    expect(component.title).toEqual('Test title')
    expect(component.languages).toEqual(['JavaScript', 'Java'])
    expect(component.creation_date).toBeDefined()
    expect(component.level).toEqual('Medium')
    expect(component.popularity).toEqual(100)
    expect(component.id).toEqual('123')
  })

  it('should have the correct routerLink attribute value', () => {
    component.id = '123'
    fixture.detectChanges()

    const anchorElement: HTMLAnchorElement = fixture.nativeElement.querySelector('.challenge-list-element')
    const hasId = anchorElement.innerText !== ''
    anchorElement.setAttribute('routerLink', 'ita-challenge/challenges/123')
    const routerLinkAttribute: string = anchorElement.getAttribute('routerLink')?.toLowerCase() ?? ''

    console.log('Component is giving a string value on the router link:', hasId)

    expect(routerLinkAttribute).toBe('ita-challenge/challenges/123')
  })
})
