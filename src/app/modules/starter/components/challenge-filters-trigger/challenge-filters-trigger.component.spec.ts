import { TestBed } from '@angular/core/testing'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ChallengeFiltersTriggerComponent } from './challenge-filters-trigger.component'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'

describe('ChallengeFiltersTriggerComponent', () => {
  const modalStub = {
    open: jasmine.createSpy('open'),
    dismissAll: jasmine.createSpy('dismissAll')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeFiltersTriggerComponent],
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
})