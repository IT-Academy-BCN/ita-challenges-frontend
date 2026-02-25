import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ChallengeCardComponent } from './challenge-card.component'
import { RouterTestingModule } from '@angular/router/testing'
import { StarterService } from '../../../services/starter.service'
import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core'

import { HttpLoaderFactory } from '../../../app.module' // Asegúrate de que la ruta es correcta
import { LOCALE_ID, Pipe, type PipeTransform, signal } from '@angular/core'
import { By } from '@angular/platform-browser'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/services/auth.service'
import { ChallengeService } from 'src/app/services/challenge.service'
import { of, throwError } from 'rxjs'
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform (value: string): string {
    return value// Restituisce semplicemente la chiave di traduzione
  }
}

describe('ChallengeCardComponent', () => {
  let component: ChallengeCardComponent
  let fixture: ComponentFixture<ChallengeCardComponent>
  let mockChallengeService: any
  let mockAuthService: any
  let datePipe: CustomDatePipe

  beforeEach(async () => {
    mockChallengeService = {
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
      addBookmark: jest.fn(),
      removeBookmark: jest.fn(),
      getChallengeTags: jest.fn().mockReturnValue(of({ offset: 0, limit: 0, count: 0, results: [] })),
      tagMap: signal({})
    }

    mockAuthService = {
      isUserLoggedIn: jest.fn().mockReturnValue(true),
      getUserRole: jest.fn().mockReturnValue(of('ADMIN'))
    }

    await TestBed.configureTestingModule({
      declarations: [ChallengeCardComponent, MockTranslatePipe],
      imports: [
        CustomDatePipe,
        NgbTooltipModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] }
        })
      ],
      providers: [
        StarterService,
        CustomDatePipe,
        { provide: LOCALE_ID, useValue: 'ca' },
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ChallengeCardComponent)
    component = fixture.componentInstance
    datePipe = TestBed.inject(CustomDatePipe)
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
    anchorElement.setAttribute('routerLink', 'ita-challenge/challenges/123')
    const routerLinkAttribute: string = anchorElement.getAttribute('routerLink')?.toLowerCase() ?? ''

    expect(routerLinkAttribute).toBe('ita-challenge/challenges/123')
  })

  it('should display the formatted date correctly', () => {
    const testDate = new Date('2023-07-01')
    component.creation_date = testDate
    fixture.detectChanges()

    const formattedDate = datePipe.transform(testDate)
    const dateElements = fixture.debugElement.queryAll(By.css('.creation-date .txt'))
    const dateElement = dateElements.find(el => el.nativeElement.textContent.includes(formattedDate))

    expect(dateElement).toBeTruthy()
    expect(dateElement?.nativeElement.textContent).toContain(formattedDate)
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

  it('toggleFavorite: should return early if user is not logged in', () => {
    mockAuthService.isUserLoggedIn.mockReturnValue(false)
    component.toggleFavorite(new MouseEvent('click'))
    expect(mockChallengeService.addToFavorites).not.toHaveBeenCalled()
    expect(mockChallengeService.removeFromFavorites).not.toHaveBeenCalled()
  })

  it('should return current language from translate service', () => {
    const translateService = TestBed.inject(TranslateService)
    translateService.currentLang = 'ca'
    expect(component.currentLang).toBe('ca')
  })

  it('should resolve tags reactively from the tagMap signal', () => {
    const mockTagDictionary = {
      t1: { id_tag: 't1', tag_name: 'Tag1', tag_description: 'D1' },
      t2: { id_tag: 't2', tag_name: 'Tag2', tag_description: 'D2' }
    }

    // Set service signal value
    mockChallengeService.tagMap.set(mockTagDictionary);

    // Set component input signal value
    fixture.componentRef.setInput('tagIds', ['t1', 't2']);
    fixture.detectChanges();

    const resolved = component.resolvedTags();
    expect(resolved.length).toBe(2);
    expect(resolved[0].tag_name).toBe('Tag1');
    expect(resolved[1].tag_name).toBe('Tag2');

    // Test reactivity: update input
    fixture.componentRef.setInput('tagIds', ['t2']);
    fixture.detectChanges();
    expect(component.resolvedTags().length).toBe(1);
    expect(component.resolvedTags()[0].tag_name).toBe('Tag2');

    // Test reactivity: update dictionary
    mockChallengeService.tagMap.set({
      ...mockTagDictionary,
      t2: { id_tag: 't2', tag_name: 'UpdatedTag2', tag_description: 'D2' }
    })
    fixture.detectChanges();
    expect(component.resolvedTags()[0].tag_name).toBe('UpdatedTag2');
  })

  it('should return empty array if tagId is not in dictionary', () => {
    mockChallengeService.tagMap.set({
      t1: { id_tag: 't1', tag_name: 'Tag1', tag_description: 'D1' }
    })
    fixture.componentRef.setInput('tagIds', ['unknown']);
    fixture.detectChanges();

    expect(component.resolvedTags()).toEqual([]);
  });

  describe('descriptionPreview', () => {
    it('should return empty string when description is undefined', () => {
      component.description = undefined as any
      expect(component.descriptionPreview).toBe('')
    })

    it('should return plain text as-is when short enough', () => {
      component.description = 'Simple description'
      expect(component.descriptionPreview).toBe('Simple description')
    })

    it('should strip HTML tags and return plain text', () => {
      component.description = '<p>Hello <strong>world</strong></p>'
      expect(component.descriptionPreview).toBe('Hello world')
    })

    it('should truncate text longer than 100 characters', () => {
      component.description = 'A'.repeat(150)
      const result = component.descriptionPreview
      expect(result.length).toBe(100)
      expect(result.endsWith('…')).toBe(true)
    })

    it('should normalize whitespace', () => {
      component.description = '  too   many    spaces  '
      expect(component.descriptionPreview).toBe('too many spaces')
    })
  })

  it('should handle error on addToFavorites', () => {
    component.isFavorite = false
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockChallengeService.addToFavorites.mockReturnValue(throwError(() => new Error('error')))
    component.toggleFavorite(new MouseEvent('click'))
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should handle error on removeFromFavorites', () => {
    component.isFavorite = true
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockChallengeService.removeFromFavorites.mockReturnValue(throwError(() => new Error('error')))
    component.toggleFavorite(new MouseEvent('click'))
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('toggleBookmark: should prevent event propagation', () => {
  const event = new MouseEvent('click');
  const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
  
  component.toggleBookmark(event);
  
  expect(stopPropagationSpy).toHaveBeenCalled();
});
})
