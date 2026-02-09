import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { of } from 'rxjs'
import { ChallengeFiltersTriggerComponent } from './challenge-filters-trigger.component'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'

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
    component.open()

    expect(modalStub.open).toHaveBeenCalled()
    const callArgs = modalStub.open.calls.mostRecent().args
    expect(callArgs[1]).toEqual(
      jasmine.objectContaining({
        windowClass: 'challenge-filters-trigger-modal',
        backdrop: 'static',
        keyboard: false
      })
    )
  })

  it('should position the dialog next to the trigger button after open', fakeAsync(() => {
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance

    component.initialFilters = { languages: [], levels: [], progress: [], tags: [] }

    const triggerEl = document.createElement('button')
    spyOn(triggerEl, 'getBoundingClientRect').and.returnValue({
      bottom: 100,
      right: 200
    } as any)

    const dialogEl = document.createElement('div') as any
    dialogEl.style = {} as any

    const querySpy = spyOn(document, 'querySelector').and.callFake((selector: string) => {
      return selector === '.challenge-filters-trigger-modal .modal-dialog' ? (dialogEl as any) : null
    })

    ;(component as any).triggerBtn = { nativeElement: triggerEl }

    component.open()
    tick()

    expect(querySpy).toHaveBeenCalledWith('.challenge-filters-trigger-modal .modal-dialog')
    expect(dialogEl.style.position).toBe('fixed')
    expect(dialogEl.style.margin).toBe('0')
    expect(dialogEl.style.top).toBe('116px')
    expect(dialogEl.style.left).toBe('auto')
    expect(dialogEl.style.right).toBe(`${Math.round(window.innerWidth - 200)}px`)
  }))
})