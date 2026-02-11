import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChallengeListFiltersComponent } from './challenge-list-filters.component'

describe('ChallengeListFiltersComponent', () => {
  let component: ChallengeListFiltersComponent
  let fixture: ComponentFixture<ChallengeListFiltersComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChallengeListFiltersComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(ChallengeListFiltersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render the filters container', () => {
    const element: HTMLElement = fixture.nativeElement
    expect(element.querySelector('#challenge-list-filters')).toBeTruthy()
  })
})