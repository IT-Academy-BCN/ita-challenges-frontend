import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { MobileNavComponent } from './mobile-nav.component'

describe('MobileNavComponent', () => {
  let component: MobileNavComponent
  let fixture: ComponentFixture<MobileNavComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MobileNavComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(MobileNavComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
