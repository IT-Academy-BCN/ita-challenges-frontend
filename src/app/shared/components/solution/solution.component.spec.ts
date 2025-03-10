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
  let solutionService: SolutionService

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
    solutionService = TestBed.inject(SolutionService)
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
  it('should initialize editor after view init', () => {
    jest.spyOn(component, 'createEditor')
    component.ngAfterViewInit()
    expect(component.createEditor).toHaveBeenCalled()
  })
  
  it('should apply correct language extension', () => {
    component.languageExt = 'python'
    component.editorSolution = { nativeElement: document.createElement('div') } as any
    component.createEditor()
    expect(component.editor.state.doc.toString()).toBe(component.solution_text)
  })

})
