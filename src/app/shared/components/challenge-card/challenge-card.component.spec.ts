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

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform (value: string): string {
    return value// Restituisce semplicemente la chiave di traduzione
  }
}

describe('ChallengeCardComponent', () => {
  let component: ChallengeCardComponent
  let fixture: ComponentFixture<ChallengeCardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChallengeCardComponent, MockTranslatePipe],
      imports: [
        NgbTooltipModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        StarterService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: LOCALE_ID, useValue: 'ca' } // Proveer LOCALE_ID para el idioma
      ]
    }).compileComponents()
  })

  beforeEach(() => {
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

    const dateElement: HTMLElement = fixture.debugElement.query(By.css('.stat:last-child div:last-child')).nativeElement
    const formattedDate = formatDate(testDate, 'mediumDate', 'ca') // Formatear la fecha para comparar

    expect(dateElement.textContent).toContain(formattedDate)
  })
})
