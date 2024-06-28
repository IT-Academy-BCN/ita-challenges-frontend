import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { SolutionComponent } from './solution.component'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { SolutionService } from '../../../services/solution.service'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('SolutionComponent with TranslateService', () => {
  let component: SolutionComponent
  let fixture: ComponentFixture<SolutionComponent>
  let translateService: TranslateService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolutionComponent],
      imports: [TranslateModule.forRoot()],
      providers: [SolutionService, TranslateService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents()
  })

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
