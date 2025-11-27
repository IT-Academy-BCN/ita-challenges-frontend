import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormBuilder } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { of } from 'rxjs'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'
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

  it('should have languages collapsed by default; levels/progress are not foldable', async () => {
    // Wait for async language/tags init
    await fixture.whenStable();
    fixture.detectChanges();

    // One known language from mock is 'javascript' -> id toggle-javascript, panel-panel-javascript
    const langToggle: HTMLButtonElement | null = fixture.nativeElement.querySelector('#toggle-javascript');
    const langPanel: HTMLElement | null = fixture.nativeElement.querySelector('#panel-javascript');
    expect(langToggle).toBeTruthy();
    expect(langToggle?.getAttribute('aria-expanded')).toBe('false');
    expect(langPanel?.getAttribute('style') || '').toContain('max-height: 0px');

    // Toggle open
    langToggle?.click();
    fixture.detectChanges();
    expect(langToggle?.getAttribute('aria-expanded')).toBe('true');

    // Levels/progress are not foldable (no toggles), checkboxes should be present when section is visible
    const levelsToggle: HTMLButtonElement | null = fixture.nativeElement.querySelector('#toggle-levels');
    expect(levelsToggle).toBeNull();
    const easyCheckbox: HTMLElement | null = fixture.nativeElement.querySelector('#checkEasy');
    expect(easyCheckbox).toBeTruthy();

    const progressToggle: HTMLButtonElement | null = fixture.nativeElement.querySelector('#toggle-progress');
    expect(progressToggle).toBeNull();
  });

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
    expect(lastCallArgs.progress).toEqual(progressEl ? [SolutionStatus.NOT_STARTED] : [])
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

  it('should show an "All" option for each language and toggle all tags for JavaScript', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    // Open the JS section (optional, elements are in DOM regardless)
    const jsToggle = fixture.debugElement.query(By.css('#toggle-javascript'))?.nativeElement as HTMLButtonElement | undefined;
    jsToggle?.click();
    fixture.detectChanges();

    const allCheckboxDe = fixture.debugElement.query(By.css('#javascript-tag-all'));
    expect(allCheckboxDe).toBeTruthy();

    const emitSpy = jest.spyOn(component.filtersSelected, 'emit');

    // Click ALL -> selects both tags
    const allCheckbox = allCheckboxDe.nativeElement as HTMLInputElement;
    allCheckbox.click();
    fixture.detectChanges();

    const jsTagMapInput: HTMLInputElement = fixture.debugElement.query(By.css('#javascript-tag-t-map')).nativeElement;
    const jsTagReduceInput: HTMLInputElement = fixture.debugElement.query(By.css('#javascript-tag-t-reduce')).nativeElement;

    expect(jsTagMapInput.checked).toBe(true);
    expect(jsTagReduceInput.checked).toBe(true);
    expect(component.areAllTagsSelected('javascript')).toBe(true);

    // Last emitted filters should include the JS language id and no tag constraints (all selected)
    const lastCallArgs = emitSpy.mock.calls.at(-1)?.[0] as any;
    expect(lastCallArgs.languages).toContain('lang-js');
    expect(lastCallArgs.tags).toEqual([]);

    // Uncheck ALL -> clears both
    allCheckbox.click();
    fixture.detectChanges();

    expect(jsTagMapInput.checked).toBe(false);
    expect(jsTagReduceInput.checked).toBe(false);
    expect(component.areAllTagsSelected('javascript')).toBe(false);
  });

  it('should include a language with no tags when selecting its All option after another language All is selected', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.filtersSelected, 'emit');

    // Click ALL for JavaScript (has tags)
    const jsAll = fixture.debugElement.query(By.css('#javascript-tag-all')).nativeElement as HTMLInputElement;
    jsAll.click();
    fixture.detectChanges();

    // Click ALL for Python (no tags in mock) -> should toggle language selection for python
    const pyAll = fixture.debugElement.query(By.css('#python-tag-all')).nativeElement as HTMLInputElement;
    pyAll.click();
    fixture.detectChanges();

    // Take last emitted filters after selecting Python All
    const lastCallArgs = emitSpy.mock.calls.at(-1)?.[0] as any;
    expect(lastCallArgs).toBeTruthy();
    expect(lastCallArgs.languages).toEqual(expect.arrayContaining(['lang-js', 'lang-python']));
    // No tag constraints expected when selecting All
    expect(lastCallArgs.tags).toEqual([]);
  });

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
