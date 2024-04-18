import { type ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BreadcrumbComponent } from './breadcrumb.component'

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent
  let fixture: ComponentFixture<BreadcrumbComponent>

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
