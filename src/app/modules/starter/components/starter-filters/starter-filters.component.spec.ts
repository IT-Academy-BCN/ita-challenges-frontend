import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormBuilder } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { I18nModule } from '../../../../../assets/i18n/i18n.module'
import { of } from 'rxjs'
import { AuthService } from 'src/app/services/auth.service'
import { ChallengeFormService } from 'src/app/services/challenge-form.service'
import { StarterFiltersComponent } from './starter-filters.component'

describe('StarterFiltersComponent', () => {
  let component: StarterFiltersComponent
  let fixture: ComponentFixture<StarterFiltersComponent>
  let authServiceMock: any;
  let challengeFormServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      getUserRole: jest.fn().mockReturnValue(of(''))
    }

    challengeFormServiceMock = {
      getAllLangugesCreateForm: jest.fn().mockReturnValue(
        of({
          results: [
            { id_language: 'lang-js', language_name: 'JavaScript' },
            { id_language: 'lang-java', language_name: 'Java' },
            { id_language: 'lang-php', language_name: 'PHP' },
            { id_language: 'lang-python', language_name: 'Python' }
          ]
        })
      ),
      getTagsByLanguage: jest.fn().mockImplementation((langId: string) => {
        if (langId === 'lang-js') {
          return of({
            results: [
              { id_tag: 't-map', tag_name: 'map' },
              { id_tag: 't-reduce', tag_name: 'reduce' }
            ]
          })
        }
        return of({ results: [] })
      })
    }

    await TestBed.configureTestingModule({
      declarations: [StarterFiltersComponent],
      imports: [ReactiveFormsModule, I18nModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: ChallengeFormService, useValue: challengeFormServiceMock }
      ]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StarterFiltersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit filtersSelected event when form value changes', () => {
    // Set up user as logged in for this test
    authServiceMock.getUserRole.mockReturnValue(of('ALUMNI'))
    component.ngOnInit()
    component.isUserLoggedIn = true
    fixture.detectChanges()

    const emitSpy = jest.spyOn(component.filtersSelected, 'emit')

    const languageInput: HTMLInputElement = fixture.debugElement.query(By.css('#check-javascript')).nativeElement
    languageInput.click()
    fixture.detectChanges()

    const levelInput: HTMLInputElement = fixture.debugElement.query(By.css('#checkEasy')).nativeElement
    levelInput.click()
    fixture.detectChanges()

    const progressElement = fixture.debugElement.query(By.css('#checkNoStarted'))
    if (progressElement) {
      const progressInput: HTMLInputElement = progressElement.nativeElement
      progressInput.click()
      fixture.detectChanges()
    }

    expect(emitSpy).toHaveBeenCalled()

    const expectedFilter = {
      languages: ['lang-js'],
      levels: ['EASY'],
      progress: progressElement ? [1] : []
    }
    expect(emitSpy).toHaveBeenCalledWith(expectedFilter)
  })

  describe('User role-based display', () => {
    it('should display progress filters when user role is not empty and not ADMIN', () => {
      authServiceMock.getUserRole.mockReturnValue(of('ALUMNI'))
      component.ngOnInit()
      fixture.detectChanges()
      expect(component.isUserLoggedIn).toBe(true)
      const progressSection = fixture.debugElement.query(By.css('[formGroupName="progress"]'))
      expect(progressSection).toBeTruthy()
    })
    it('should display progress filters when user role is ADMIN', () => {
      authServiceMock.getUserRole.mockReturnValue(of('ADMIN'))
      component.ngOnInit()
      fixture.detectChanges()
      expect(component.isUserLoggedIn).toBe(true)
      const progressSection = fixture.debugElement.query(By.css('[formGroupName="progress"]'))
      expect(progressSection).toBeTruthy()
    })
    it('should hide progress filters when user is not logged in (empty role)', () => {
      authServiceMock.getUserRole.mockReturnValue(of(''))
      component.ngOnInit()
      fixture.detectChanges()
      expect(component.isUserLoggedIn).toBe(false)
      const progressSection = fixture.debugElement.query(By.css('[formGroupName="progress"]'))
      expect(progressSection).toBeFalsy()
    })
  })


  it('should render JavaScript tag checkboxes once tags are loaded', () => {
    fixture.detectChanges()

    const jsTagMap = fixture.debugElement.query(By.css('#javascript-tag-t-map'))
    const jsTagReduce = fixture.debugElement.query(By.css('#javascript-tag-t-reduce'))

    expect(jsTagMap).toBeTruthy()
    expect(jsTagReduce).toBeTruthy()
  })

  it('should toggle JS tag checkboxes and reflect the form state', () => {
    fixture.detectChanges()

    const jsTagMapInput: HTMLInputElement =
      fixture.debugElement.query(By.css('#javascript-tag-t-map')).nativeElement
    const jsTagReduceInput: HTMLInputElement =
      fixture.debugElement.query(By.css('#javascript-tag-t-reduce')).nativeElement

    jsTagMapInput.click()
    jsTagReduceInput.click()
    fixture.detectChanges()

    expect(jsTagMapInput.checked).toBe(true)
    expect(jsTagReduceInput.checked).toBe(true)

    const jsTagsGroup = component.tagsForm.get('javascript')
    expect(jsTagsGroup?.get('t-map')?.value).toBe(true)
    expect(jsTagsGroup?.get('t-reduce')?.value).toBe(true)

    jsTagMapInput.click()
    fixture.detectChanges()

    expect(jsTagMapInput.checked).toBe(false)
    expect(jsTagsGroup?.get('t-map')?.value).toBe(false)
  })

  it('should uncheck all JS tags when JavaScript language is unchecked', () => {
    fixture.detectChanges()

    const jsLangInput: HTMLInputElement =
      fixture.debugElement.query(By.css('#check-javascript')).nativeElement
    jsLangInput.click()
    fixture.detectChanges()

    const jsTagMapInput: HTMLInputElement =
      fixture.debugElement.query(By.css('#javascript-tag-t-map')).nativeElement
    const jsTagReduceInput: HTMLInputElement =
      fixture.debugElement.query(By.css('#javascript-tag-t-reduce')).nativeElement

    jsTagMapInput.click()
    jsTagReduceInput.click()
    fixture.detectChanges()

    expect(jsTagMapInput.checked).toBe(true)
    expect(jsTagReduceInput.checked).toBe(true)

    jsLangInput.click()
    fixture.detectChanges()

    expect(jsTagMapInput.checked).toBe(false)
    expect(jsTagReduceInput.checked).toBe(false)

    const jsTagsGroup = component.tagsForm.get('javascript')
    expect(jsTagsGroup?.get('t-map')?.value).toBe(false)
    expect(jsTagsGroup?.get('t-reduce')?.value).toBe(false)
  })
})
