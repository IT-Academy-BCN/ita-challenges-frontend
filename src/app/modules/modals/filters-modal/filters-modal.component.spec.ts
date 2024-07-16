import { TestBed } from '@angular/core/testing'
import { FiltersModalComponent } from './filters-modal.component'
import { AuthService } from 'src/app/services/auth.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('FiltersModalComponent', () => {
  let component: FiltersModalComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltersModalComponent],
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    })
      .compileComponents()
  })

  beforeEach(() => {
    const fixture = TestBed.createComponent(FiltersModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
