import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { of } from 'rxjs'
import { ChallengeFiltersTriggerComponent } from './challenge-filters-trigger.component'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'
import { ChallengeFormService } from 'src/app/services/challenge-form.service'
import { ChallengeService } from 'src/app/services/challenge.service'
import { signal } from '@angular/core'

class TranslateLoaderStub implements TranslateLoader {
  getTranslation() {
    return of({})
  }
}

describe('ChallengeFiltersTriggerComponent', () => {
  const modalStub = {
    open: jasmine.createSpy('open'),
    dismissAll: jasmine.createSpy('dismissAll')
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
        {
          provide: NgbModal,
          useValue: modalStub
        },
        {
          provide: ChallengeFormService,
          useValue: {
            getTagsByLanguage: jest.fn().mockReturnValue(of({ offset: 0, limit: 0, count: 0, results: [] })),
            getAllLangugesCreateForm: jest.fn().mockReturnValue(of({ results: [] }))
          }
        },
        {
          provide: ChallengeService,
          useValue: {
            tagMap: signal({})
          }
        }
      ]
    }).compileComponents()
  })

  it('should create', () => {
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })

  it('should emit subset filters (levels/tags/progress) on apply', () => {
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance

    component.initialFilters = {
      languages: ['ts', 'js'],
      levels: ['EASY', 'HARD'],
      tags: ['arrays', 'dp'],
      progress: [SolutionStatus.NOT_STARTED, SolutionStatus.IN_PROGRESS]
    }

    let emittedValue: unknown
    component.filtersApplied.subscribe((value) => {
      emittedValue = value
    })

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
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance

    component.initialFilters = { languages: [], levels: [], progress: [], tags: [] }
    component.open()

    expect(component.isLevelSelected('EASY')).toBe(false)

    component.toggleLevel('EASY')
    expect(component.isLevelSelected('EASY')).toBe(true)

    component.toggleLevel('EASY')
    expect(component.isLevelSelected('EASY')).toBe(false)
  })

  it('should toggle progress statuses in draft state and emit them on apply', () => {
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance

    component.initialFilters = { languages: [], levels: [], progress: [], tags: [] }
    component.open()

    component.toggleProgress(SolutionStatus.IN_PROGRESS)
    component.toggleProgress(SolutionStatus.ENDED)

    let emittedValue: unknown
    component.filtersApplied.subscribe((value) => {
      emittedValue = value
    })

    component.onApply()

    expect(emittedValue).toEqual({
      levels: [],
      tags: [],
      progress: [SolutionStatus.IN_PROGRESS, SolutionStatus.ENDED]
    })
  })

  it('should open modal with apply-only config', () => {
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance

    component.initialFilters = { languages: [], levels: [], progress: [], tags: [] }
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
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance

    component.initialFilters = { languages: [], levels: [], progress: [], tags: [] }
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
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance

    component.initialFilters = { languages: [], levels: [], progress: [], tags: [] }
    component.open()

    component.toggleTag('tag-id-1')
    component.toggleTag('tag-id-2')

    let emittedValue: unknown
    component.filtersApplied.subscribe((value) => {
      emittedValue = value
    })

    component.onApply()

    expect(emittedValue).toEqual({
      levels: [],
      tags: ['tag-id-1', 'tag-id-2'],
      progress: []
    })
  })

  it('should pre-select tags from initialFilters when modal opens', () => {
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance

    component.initialFilters = { languages: [], levels: [], progress: [], tags: ['tag-id-1', 'tag-id-3'] }
    component.open()

    expect(component.isTagSelected('tag-id-1')).toBe(true)
    expect(component.isTagSelected('tag-id-3')).toBe(true)
    expect(component.isTagSelected('tag-id-2')).toBe(false)
  })

  it('should fetch tags and populate displayTags with language names', () => {
    const mockService = TestBed.inject(ChallengeFormService) as jest.Mocked<ChallengeFormService>
    mockService.getAllLangugesCreateForm = jest.fn().mockReturnValue(of({ results: [
      { id_language: 'lang-1', language_name: 'Javascript' },
      { id_language: 'lang-2', language_name: 'Python' }
    ]}))
    mockService.getTagsByLanguage = jest.fn().mockImplementation((langId: string) => {
      if (langId === 'lang-1') {
        return of({ offset: 0, limit: 0, count: 2, results: [
          { id_tag: 'tag-1', tag_name: 'Arrays', tag_description: '' },
          { id_tag: 'tag-2', tag_name: 'Loops', tag_description: '' }
        ]})
      }
      return of({ offset: 0, limit: 0, count: 1, results: [
        { id_tag: 'tag-3', tag_name: 'Decorators', tag_description: '' }
      ]})
    })

    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance

    component.initialFilters = { languages: ['lang-1', 'lang-2'], levels: [], progress: [], tags: [] }

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
    const mockService = TestBed.inject(ChallengeFormService) as jest.Mocked<ChallengeFormService>
    mockService.getAllLangugesCreateForm = jest.fn().mockReturnValue(of({ results: [] }))
    mockService.getTagsByLanguage = jest.fn().mockReturnValue(
      of({ offset: 0, limit: 0, count: 0, results: [] })
    )

    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance

    component.initialFilters = { languages: ['unknown-lang-id'], levels: [], progress: [], tags: [] }

    component.open()

    expect(component.displayTags[0].language).toBe('unknown-lang-id')
  })

  it('should position the dialog next to the trigger button after open', fakeAsync(() => {
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance

    component.initialFilters = { languages: [], levels: [], progress: [], tags: [] }

    const triggerEl = document.createElement('button')
    ;(triggerEl as any).getBoundingClientRect = () => ({ bottom: 100, right: 200 } as any)

    const dialogEl = document.createElement('div') as any

    const querySpy = spyOn(document, 'querySelector').and.callFake((selector: string) => {
      return selector === '.challenge-filters-trigger-modal .modal-dialog' ? (dialogEl as any) : null
    })

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
})