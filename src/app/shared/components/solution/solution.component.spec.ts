import { type ComponentFixture, TestBed, async } from '@angular/core/testing'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { SolutionComponent } from './solution.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { SolutionService } from '../../../services/solution.service'

describe('SolutionComponent with TranslateService', () => {
  let component: SolutionComponent
  let fixture: ComponentFixture<SolutionComponent>
  let translateService: TranslateService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [SolutionComponent],
      providers: [SolutionService, TranslateService]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionComponent)
    component = fixture.componentInstance
    translateService = TestBed.inject(TranslateService)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have TranslateService', () => {
    expect(translateService).toBeDefined()
    expect(translateService).toBeInstanceOf(TranslateService)
  })
})
