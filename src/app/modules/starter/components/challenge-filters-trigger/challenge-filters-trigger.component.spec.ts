import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { of, throwError } from 'rxjs'
import { ChallengeFiltersTriggerComponent } from './challenge-filters-trigger.component'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'
import { ChallengeFormService } from 'src/app/services/challenge-form.service'

class TranslateLoaderStub implements TranslateLoader {
  getTranslation() {
    return of({})
  }
}

function getMockService() {
  return TestBed.inject(ChallengeFormService) as jest.Mocked<ChallengeFormService>
}

function tagResponse(results: { id_tag: string; tag_name: string; tag_description: string }[]) {
  return of({ offset: 0, limit: 0, count: results.length, results })
}

function configureMockService(
  languages: { id_language: string; language_name: string }[],
  tagsFn: jest.Mock
) {
  const svc = getMockService()
  svc.getAllLangugesCreateForm = jest.fn().mockReturnValue(of({ results: languages }))
  svc.getTagsByLanguage = tagsFn
  return svc
}

describe('ChallengeFiltersTriggerComponent', () => {
  const modalStub = {
    open: jasmine.createSpy('open'),
    dismissAll: jasmine.createSpy('dismissAll')
  }

  const emptyFilters = { languages: [] as string[], levels: [] as string[], progress: [] as SolutionStatus[], tags: [] as string[] }

  function createComponent(filters = emptyFilters) {
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance
    component.initialFilters = { ...filters }
    return { fixture, component }
  }

  beforeEach(async () => {
    modalStub.open.calls.reset()
    modalStub.dismissAll.calls.reset()

    await TestBed.configureTestingModule({
      imports: [
        ChallengeFiltersTriggerComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderStub
          }
        })
      ],

      providers: [
        { provide: NgbModal, useValue: modalStub },
        {
          provide: ChallengeFormService,
          useValue: {
            getTagsByLanguage: jest.fn().mockReturnValue(of({ offset: 0, limit: 0, count: 0, results: [] })),
            getAllLangugesCreateForm: jest.fn().mockReturnValue(of({ results: [] }))
          }
        }
      ]
    }).compileComponents()
  })

  it('should create', () => {
    const { component } = createComponent()
    expect(component).toBeTruthy()
  })

  it('should emit subset filters (levels/tags/progress) on apply', () => {
    const { component } = createComponent({
      languages: ['ts', 'js'],
      levels: ['EASY', 'HARD'],
      tags: ['arrays', 'dp'],
      progress: [SolutionStatus.NOT_STARTED, SolutionStatus.IN_PROGRESS]
    })

    let emittedValue: unknown
    component.filtersApplied.subscribe((value) => { emittedValue = value })

    component.open()
    component.onApply()

    expect(emittedValue).toEqual({
      levels: ['EASY', 'HARD'],
      tags: ['arrays', 'dp'],
      progress: [SolutionStatus.NOT_STARTED, SolutionStatus.IN_PROGRESS]
    })
    expect((emittedValue as any).languages).toBeUndefined()
  })

  it('should toggle difficulty levels in draft state', () => {
    const { component } = createComponent()
    component.open()

    expect(component.isLevelSelected('EASY')).toBe(false)
    component.toggleLevel('EASY')
    expect(component.isLevelSelected('EASY')).toBe(true)
    component.toggleLevel('EASY')
    expect(component.isLevelSelected('EASY')).toBe(false)
  })

  it('should toggle progress statuses in draft state and emit them on apply', () => {
    const { component } = createComponent()
    component.open()

    component.toggleProgress(SolutionStatus.IN_PROGRESS)
    component.toggleProgress(SolutionStatus.ENDED)

    let emittedValue: unknown
    component.filtersApplied.subscribe((value) => { emittedValue = value })
    component.onApply()

    expect(emittedValue).toEqual({
      levels: [],
      tags: [],
      progress: [SolutionStatus.IN_PROGRESS, SolutionStatus.ENDED]
    })
  })

  it('should open modal with apply-only config', () => {
    const { fixture, component } = createComponent()
    fixture.detectChanges()

    ;(component as any).modalService = modalStub
    ;(component as any).modalTemplate = {} as any
    component.open()

    expect(modalStub.open).toHaveBeenCalled()
    const callArgs = modalStub.open.calls.mostRecent().args
    expect(callArgs[1]).toEqual(
      jasmine.objectContaining({
        windowClass: 'challenge-filters-trigger-modal',
        backdrop: true,
        keyboard: true
      })
    )
  })

  it('should toggle tags in draft state', () => {
    const { component } = createComponent()
    component.open()

    expect(component.isTagSelected('tag-id-1')).toBe(false)
    component.toggleTag('tag-id-1')
    expect(component.isTagSelected('tag-id-1')).toBe(true)

    component.toggleTag('tag-id-2')
    expect(component.isTagSelected('tag-id-2')).toBe(true)

    component.toggleTag('tag-id-1')
    expect(component.isTagSelected('tag-id-1')).toBe(false)
    expect(component.isTagSelected('tag-id-2')).toBe(true)
  })

  it('should include selected tags in emitted filters on apply', () => {
    const { component } = createComponent()
    component.open()

    component.toggleTag('tag-id-1')
    component.toggleTag('tag-id-2')

    let emittedValue: unknown
    component.filtersApplied.subscribe((value) => { emittedValue = value })
    component.onApply()

    expect(emittedValue).toEqual({ levels: [], tags: ['tag-id-1', 'tag-id-2'], progress: [] })
  })

  it('should pre-select tags from initialFilters when modal opens', () => {
    const { component } = createComponent({ ...emptyFilters, tags: ['tag-id-1', 'tag-id-3'] })
    component.open()

    expect(component.isTagSelected('tag-id-1')).toBe(true)
    expect(component.isTagSelected('tag-id-3')).toBe(true)
    expect(component.isTagSelected('tag-id-2')).toBe(false)
  })

  it('should fetch tags and populate displayTags with language names', () => {
    configureMockService(
      [{ id_language: 'lang-1', language_name: 'Javascript' }, { id_language: 'lang-2', language_name: 'Python' }],
      jest.fn().mockImplementation((langId: string) =>
        langId === 'lang-1'
          ? tagResponse([{ id_tag: 'tag-1', tag_name: 'Arrays', tag_description: '' }, { id_tag: 'tag-2', tag_name: 'Loops', tag_description: '' }])
          : tagResponse([{ id_tag: 'tag-3', tag_name: 'Decorators', tag_description: '' }])
      )
    )

    const { component } = createComponent({ ...emptyFilters, languages: ['lang-1', 'lang-2'] })
    component.open()

    expect(component.displayTags.length).toBe(2)
    expect(component.displayTags[0]).toEqual({
      language: 'Javascript',
      tags: [{ id_tag: 'tag-1', tag_name: 'Arrays', tag_description: '' }, { id_tag: 'tag-2', tag_name: 'Loops', tag_description: '' }]
    })
    expect(component.displayTags[1]).toEqual({
      language: 'Python',
      tags: [{ id_tag: 'tag-3', tag_name: 'Decorators', tag_description: '' }]
    })
  })

  it('should fall back to language ID when language name is not found', () => {
    const { component } = createComponent({ ...emptyFilters, languages: ['unknown-lang-id'] })
    component.open()

    expect(component.displayTags[0].language).toBe('unknown-lang-id')
  })

  it('should return correct selectedFiltersCount', () => {
    const { component } = createComponent()
    expect(component.selectedFiltersCount).toBe(0)

    component.initialFilters = { languages: ['lang-1'], levels: ['EASY', 'HARD'], progress: [SolutionStatus.IN_PROGRESS], tags: ['t1'] }
    expect(component.selectedFiltersCount).toBe(4)
  })

  it('should return 0 selectedFiltersCount when tags is undefined', () => {
    const { component } = createComponent()
    component.initialFilters = { languages: [], levels: ['EASY'], progress: [] } as any
    expect(component.selectedFiltersCount).toBe(1)
  })

  it('should dismiss modal on cancel', () => {
    const { component } = createComponent()
    const dismissSpy = jasmine.createSpy('dismissAll')
    ;(component as any).modalService = { ...modalStub, dismissAll: dismissSpy }

    component.onCancel()
    expect(dismissSpy).toHaveBeenCalled()
  })

  it('should dismiss modal on apply', () => {
    const { component } = createComponent()
    const dismissSpy = jasmine.createSpy('dismissAll')
    ;(component as any).modalService = { ...modalStub, dismissAll: dismissSpy }

    component.open()
    dismissSpy.calls.reset()
    component.onApply()
    expect(dismissSpy).toHaveBeenCalledTimes(1)
  })

  it('should use cached tags on second fetchTags call', () => {
    const svc = configureMockService(
      [{ id_language: 'lang-1', language_name: 'Javascript' }],
      jest.fn().mockReturnValue(tagResponse([{ id_tag: 'tag-1', tag_name: 'Arrays', tag_description: '' }]))
    )

    const { component } = createComponent({ ...emptyFilters, languages: ['lang-1'] })

    component.open()
    expect(component.displayTags.length).toBe(1)
    expect(svc.getTagsByLanguage).toHaveBeenCalledTimes(1)

    component.open()
    expect(component.displayTags.length).toBe(1)
    expect(svc.getTagsByLanguage).toHaveBeenCalledTimes(1)
  })

  it('should use cached language names on second fetchTags call', () => {
    const svc = configureMockService(
      [{ id_language: 'lang-1', language_name: 'Javascript' }],
      jest.fn().mockReturnValue(tagResponse([]))
    )

    const { component } = createComponent({ ...emptyFilters, languages: ['lang-1'] })

    component.open()
    expect(svc.getAllLangugesCreateForm).toHaveBeenCalledTimes(1)

    component.open()
    expect(svc.getAllLangugesCreateForm).toHaveBeenCalledTimes(1)
  })

  it('should still fetch tags when loadLanguageNames API fails', () => {
    configureMockService(
      [],
      jest.fn().mockReturnValue(tagResponse([{ id_tag: 'tag-1', tag_name: 'Loops', tag_description: '' }]))
    )
    getMockService().getAllLangugesCreateForm = jest.fn().mockReturnValue(throwError(() => new Error('API error')))

    const { component } = createComponent({ ...emptyFilters, languages: ['lang-1'] })
    component.open()

    expect(component.displayTags.length).toBe(1)
    expect(component.displayTags[0].language).toBe('lang-1')
    expect(component.displayTags[0].tags[0].tag_name).toBe('Loops')
  })

  it('should handle null results in API response gracefully', () => {
    const svc = getMockService()
    svc.getAllLangugesCreateForm = jest.fn().mockReturnValue(of({ results: null }))
    svc.getTagsByLanguage = jest.fn().mockReturnValue(of({ offset: 0, limit: 0, count: 0, results: null }))

    const { component } = createComponent({ ...emptyFilters, languages: ['lang-1'] })
    component.open()

    expect(component.displayTags.length).toBe(1)
    expect(component.displayTags[0].language).toBe('lang-1')
    expect(component.displayTags[0].tags).toEqual([])
  })

  it('should clear displayTags before fetching new ones', () => {
    const { component } = createComponent({ ...emptyFilters, languages: ['lang-1'] })
    component.displayTags = [{ language: 'Old', tags: [] }]

    component.fetchTags()

    expect(component.displayTags.every(g => g.language !== 'Old')).toBe(true)
  })

  it('should position the dialog next to the trigger button after open', fakeAsync(() => {
    const { fixture, component } = createComponent()

    const triggerEl = document.createElement('button')
    ;(triggerEl as any).getBoundingClientRect = () => ({ bottom: 100, right: 200 } as any)

    const dialogEl = document.createElement('div') as any
    const querySpy = spyOn(document, 'querySelector').and.callFake((selector: string) =>
      selector === '.challenge-filters-trigger-modal .modal-dialog' ? (dialogEl as any) : null
    )

    fixture.detectChanges()
    ;(component as any).modalService = modalStub
    ;(component as any).modalTemplate = {} as any
    ;(component as any).triggerBtn = { nativeElement: triggerEl }

    component.open()
    tick()

    expect(querySpy).toHaveBeenCalledWith('.challenge-filters-trigger-modal .modal-dialog')
    expect(dialogEl.style.position).toBe('fixed')
    expect(dialogEl.style.margin).toBe('0px')
    expect(dialogEl.style.top).toBe('116px')
    expect(['', 'auto']).toContain(dialogEl.style.left)
    expect(dialogEl.style.right).toBe(`${Math.round(window.innerWidth - 200)}px`)
  }))

  it('should not apply positioning styles when triggerBtn is missing', fakeAsync(() => {
    const { fixture, component } = createComponent()
    fixture.detectChanges()

    const dialogEl = document.createElement('div')
    spyOn(document, 'querySelector').and.returnValue(dialogEl)

    ;(component as any).modalService = modalStub
    ;(component as any).modalTemplate = {} as any
    ;(component as any).triggerBtn = undefined

    component.open()
    tick()

    expect(dialogEl.style.position).toBe('')
  }))
})