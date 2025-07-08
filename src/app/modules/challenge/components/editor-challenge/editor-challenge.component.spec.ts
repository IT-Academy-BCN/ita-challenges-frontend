import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { EditorChallengeComponent } from './editor-challenge.component'
import { ChangeDetectorRef } from '@angular/core'
import { of, Subject } from 'rxjs'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('EditorChallengeComponent', () => {
  let component: EditorChallengeComponent
  let fixture: ComponentFixture<EditorChallengeComponent>
  let translateService: jest.Mocked<TranslateService>
  const mockCdr = { detectChanges: jest.fn() }
  const mockSolutionService = {
    solutionText: jest.fn()
  }
  beforeEach(async () => {
    translateService = {
      get: jest.fn().mockReturnValue(of('// Escribe tu solución aquí')),
      onLangChange: new Subject(),
      addLangs: jest.fn(),
      setDefaultLang: jest.fn(),
      use: jest.fn()
    } as any

    await TestBed.configureTestingModule({
      declarations: [EditorChallengeComponent],
      imports: [TranslateModule.forRoot(),HttpClientTestingModule],
      providers: [
        { provide: TranslateService, useValue: translateService },
        { provide: ChangeDetectorRef, useValue: mockCdr }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(EditorChallengeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize CodeMirror when isEditorChallengeVisible is true', () => {
    component.isEditorChallengeVisible = true
    fixture.detectChanges()
    component.initializeCodeMirror()
    expect(component['isEditorInitialized']).toBeTruthy()
  })

  it('should update editor content when language changes', () => {
    component.isEditorChallengeVisible = true
    fixture.detectChanges()
    component.initializeCodeMirror()
    jest.spyOn(component['editor'], 'dispatch')
    translateService.onLangChange.next({ lang: 'ca', translations: {} })
    expect(component['editor'].dispatch).toHaveBeenCalled()
  })

  it('should subscribe to onLangChange in ngOnInit', () => {
    jest.spyOn(translateService.onLangChange, 'subscribe')
    component.ngOnInit()
    expect(translateService.onLangChange.subscribe).toHaveBeenCalled()
  })

  it('should destroy editor and unsubscribe langChangeSub in ngOnDestroy', () => {
    component['editor'] = { destroy: jest.fn() } as any
    component['langChangeSub'] = { unsubscribe: jest.fn() } as any

    component.ngOnDestroy()

    expect(component['editor'].destroy).toHaveBeenCalled()

    if (component['langChangeSub']) {
      expect(component['langChangeSub'].unsubscribe).toHaveBeenCalled()
    }
  })

})
