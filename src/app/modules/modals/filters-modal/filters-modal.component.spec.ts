import { async, type ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { FiltersModalComponent } from './filters-modal.component'

describe('FiltersModalComponent', () => {
  let component: FiltersModalComponent
  let fixture: ComponentFixture<FiltersModalComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersModalComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
