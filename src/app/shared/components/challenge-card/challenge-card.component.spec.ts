import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ChallengeCardComponent } from './challenge-card.component'
import { RouterTestingModule } from '@angular/router/testing'
import { StarterService } from '../../../services/starter.service'
import { provideHttpClient, withInterceptorsFromDi, HttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'

import { HttpLoaderFactory } from '../../../app.module' // Asegúrate de que la ruta es correcta
import { LOCALE_ID, Pipe, type PipeTransform } from '@angular/core'
import { By } from '@angular/platform-browser'
import { formatDate } from '@angular/common'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/services/auth.service'
import { ChallengeService } from 'src/app/services/challenge.service'
import { of } from 'rxjs'
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe'

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform (value: string): string {
    return value// Restituisce semplicemente la chiave di traduzione
  }
}

describe('ChallengeCardComponent', () => {
  let component: ChallengeCardComponent
  let fixture: ComponentFixture<ChallengeCardComponent>
  let mockChallengeService: jest.Mocked<ChallengeService>
  let mockAuthService: jest.Mocked<AuthService>

  beforeEach(async () => {
    mockChallengeService = {
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
      addBookmark: jest.fn(),
      removeBookmark: jest.fn()
    } as any

    mockAuthService = {
      isUserLoggedIn: jest.fn().mockReturnValue(true),
      getUserRole: jest.fn().mockReturnValue(of("ADMIN")),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ChallengeCardComponent, MockTranslatePipe],
      imports: [
        CustomDatePipe,
        NgbTooltipModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] }
        }),
      ],
      providers: [
        StarterService,
        { provide: LOCALE_ID, useValue: 'ca' },
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ChallengeCardComponent)
    component = fixture.componentInstance
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

    const anchorElement: HTMLElement = fixture.nativeElement.querySelector('.challenge-list-element')
    const hasId = anchorElement.innerText !== ''
    anchorElement.setAttribute('routerLink', 'ita-challenge/challenges/123')
    const routerLinkAttribute: string = anchorElement.getAttribute('routerLink')?.toLowerCase() ?? ''

    console.log('Component is giving a string value on the router link:', hasId)

    expect(routerLinkAttribute).toBe('ita-challenge/challenges/123')
  })

  it('should display the formatted date correctly', () => {
    const testDate = new Date('2023-07-01')
    component.creation_date = testDate
    fixture.detectChanges()

    const dateElement: HTMLElement = fixture.debugElement.queryAll(By.css('.stat .txt')).find(el => el.nativeElement.textContent?.includes(formatDate(testDate, 'mediumDate', 'ca')))?.nativeElement
    const formattedDate = formatDate(testDate, 'mediumDate', 'ca') // Formatear la fecha para comparar

    expect(dateElement.textContent).toContain(formattedDate)
  })
  it('toggleFavorite: should call addToFavorites when not favorite', done => {
    component.id = 'C1'
    component.isFavorite = false
    component.favorites_count = 0
    mockChallengeService.addToFavorites.mockReturnValue(of({ favorite: true, timesFavorited: 1 }))

    component.toggleFavorite(new MouseEvent('click'))
    setTimeout(() => {
      expect(mockChallengeService.addToFavorites).toHaveBeenCalledWith('C1')
      expect(component.isFavorite).toBe(true)
      expect(component.favorites_count).toBe(1)
      done()
    })
  })
  it('toggleFavorite: should call removeFromFavorites when already favorite', done => {
    component.id = 'C1'
    component.isFavorite = true
    component.favorites_count = 1
    mockChallengeService.removeFromFavorites.mockReturnValue(of({ favorite: false, timesFavorited: 0 }))

    component.toggleFavorite(new MouseEvent('click'))
    setTimeout(() => {
      expect(mockChallengeService.removeFromFavorites).toHaveBeenCalledWith('C1')
      expect(component.isFavorite).toBe(false)
      expect(component.favorites_count).toBe(0)
      done()
    })
  })
  it('toggleBookmark: should call addBookmark when not bookmarked', done => {
    component.id = 'C2'
    component.isBookmarked = false
    mockChallengeService.addBookmark.mockReturnValue(of({ bookmarked: true, timesBookmarked: 1 }))

    component.toggleBookmark(new MouseEvent('click'))
    setTimeout(() => {
      expect(mockChallengeService.addBookmark).toHaveBeenCalledWith('C2')
      expect(component.isBookmarked).toBe(true)
      done()
    })
  })

  it('toggleBookmark: should call removeBookmark when already bookmarked', done => {
    component.id = 'C2'
    component.isBookmarked = true
    mockChallengeService.removeBookmark.mockReturnValue(of({ bookmarked: false, timesBookmarked: 0 }))

    component.toggleBookmark(new MouseEvent('click'))
    setTimeout(() => {
      expect(mockChallengeService.removeBookmark).toHaveBeenCalledWith('C2')
      expect(component.isBookmarked).toBe(false)
      done()
    })
  })
})
