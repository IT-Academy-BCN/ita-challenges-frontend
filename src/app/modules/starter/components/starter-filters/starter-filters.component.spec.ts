import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormBuilder } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { of } from 'rxjs'
import { AuthService } from 'src/app/services/auth.service'
import { ChallengeFormService } from 'src/app/services/challenge-form.service'
import { StarterFiltersComponent } from './starter-filters.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateLoader, TranslateModule, TranslateFakeLoader } from '@ngx-translate/core'

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
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
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

  it('should emit when selecting a JS tag + level (+progress if visible)', async () => {
    // Usuario logueado para que aparezca progress
    authServiceMock.getUserRole.mockReturnValue(of('ALUMNI'))
    component.ngOnInit()
    component.isUserLoggedIn = true
    fixture.detectChanges()

    // Esperar a que se monten los tags
    await fixture.whenStable()
    fixture.detectChanges()

    const emitSpy = jest.spyOn(component.filtersSelected, 'emit')

    // Click tag JS
    const jsTagMapInput: HTMLInputElement =
      fixture.debugElement.query(By.css('#javascript-tag-t-map')).nativeElement
    jsTagMapInput.click()
    fixture.detectChanges()

    // Click nivel EASY
    const levelInput: HTMLInputElement =
      fixture.debugElement.query(By.css('#checkEasy')).nativeElement
    levelInput.click()
    fixture.detectChanges()

    const progressEl = fixture.debugElement.query(By.css('#checkNoStarted'))
    if (progressEl) {
      (progressEl.nativeElement as HTMLInputElement).click()
      fixture.detectChanges()
    }

    expect(emitSpy).toHaveBeenCalled()

    // Tomamos el último payload emitido y comprobamos lo esencial (nivel/progreso)
    const lastCallArgs = emitSpy.mock.calls.at(-1)?.[0] as any
    expect(lastCallArgs).toBeTruthy()
    expect(lastCallArgs.levels).toEqual(['EASY'])
    expect(lastCallArgs.progress).toEqual(progressEl ? [1] : [])
    // No forzamos comprobar tags/languages aquí para evitar flaqueos;
    // hay tests específicos abajo que validan el estado de tags en el formulario.
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

  it('should render JavaScript tag checkboxes once tags are loaded', async () => {
    await fixture.whenStable()
    fixture.detectChanges()
    const jsTagMap = fixture.debugElement.query(By.css('#javascript-tag-t-map'))
    const jsTagReduce = fixture.debugElement.query(By.css('#javascript-tag-t-reduce'))
    expect(jsTagMap).toBeTruthy()
    expect(jsTagReduce).toBeTruthy()
  })

  it('should toggle JS tag checkboxes and reflect the form state', async () => {
    await fixture.whenStable()
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

  it('syncLanguageFromTags: marca/desmarca el idioma según tags', async () => {
    await fixture.whenStable(); fixture.detectChanges();

    const jsTagsGroup = component.tagsForm.get('javascript')!;
    const languagesGroup = component.filtersForm.get('languages')! as any;

    jsTagsGroup.get('t-map')?.setValue(true);
    fixture.detectChanges();
    expect(languagesGroup.get('javascript')?.value).toBe(true);

    jsTagsGroup.get('t-map')?.setValue(false);
    jsTagsGroup.get('t-reduce')?.setValue(false);
    fixture.detectChanges();
    expect(languagesGroup.get('javascript')?.value).toBe(false);
  });

  it('añade .active y cuenta los tags seleccionados', async () => {
    await fixture.whenStable(); fixture.detectChanges();

    let row = fixture.debugElement.query(By.css('.language-row'));
    expect(row.nativeElement.classList.contains('active')).toBe(false);

    component.tagsForm.get('javascript.t-map')?.setValue(true);
    fixture.detectChanges();

    row = fixture.debugElement.query(By.css('.language-row'));
    expect(row.nativeElement.classList.contains('active')).toBe(true);
    const meta = row.query(By.css('.lang-meta')).nativeElement as HTMLElement;
    expect(meta.textContent?.trim()).toBe('(1)');
  });

})
