import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { FiltersModalComponent } from './filters-modal.component'

describe('FiltersModalComponent', () => {
  let component: FiltersModalComponent
  let fixture: ComponentFixture<FiltersModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltersModalComponent]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
