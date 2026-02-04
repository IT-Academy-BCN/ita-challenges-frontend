import { TestBed } from '@angular/core/testing'
import { ChallengeFiltersTriggerComponent } from './challenge-filters-trigger.component'

describe('ChallengeFiltersTriggerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeFiltersTriggerComponent]
    }).compileComponents()
  })

  it('should create', () => {
    const fixture = TestBed.createComponent(ChallengeFiltersTriggerComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})