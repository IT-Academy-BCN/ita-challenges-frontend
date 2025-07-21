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

   it('should detect changes and initialize CodeMirror on isEditorChallengeVisible change', () => {
    const spyInit = jest.spyOn(component as any, 'initializeCodeMirror');
    component.isEditorChallengeVisible = true;
    component.ngOnChanges({
      isEditorChallengeVisible: {
        currentValue: true,
        previousValue: false,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    expect(spyInit).toHaveBeenCalled();
  });


  it('should call initializeCodeMirror in ngOnInit if editor is visible', () => {
    component.isEditorChallengeVisible = true
    const spy = jest.spyOn(component as any, 'initializeCodeMirror')
    component.ngOnInit()
    expect(spy).toHaveBeenCalled()
  })

  it('should update editor when solutionText changes', () => {
    component.isEditorChallengeVisible = true;
    fixture.detectChanges();
    component.initializeCodeMirror();
    const spy = jest.spyOn(component['editor'], 'dispatch');
    component.solutionText = 'nuevo texto';
    fixture.detectChanges();
    component.ngOnChanges({
      solutionText: {
        currentValue: 'nuevo texto',
        previousValue: '',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should update editor when initialContent changes', () => {
    component.isEditorChallengeVisible = true;
    fixture.detectChanges();
    component.initializeCodeMirror();
    const spy = jest.spyOn(component['editor'], 'dispatch');
    component.initialContent = 'nuevo contenido';
    fixture.detectChanges();
    component.ngOnChanges({
      initialContent: {
        currentValue: 'nuevo contenido',
        previousValue: '',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(spy).toHaveBeenCalled();
  });

it('should not re-initialize if isEditorInitialized is true', () => {
  component['isEditorInitialized'] = true
  const spy = jest.spyOn(translateService, 'get')
  component.initializeCodeMirror()
  expect(spy).not.toHaveBeenCalled()
})

it('should emit solutionChanged when content changes manually', () => {
  const spy = jest.spyOn(component.solutionChanged, 'emit')
  component.onEditorContentChange('nuevo contenido')
  expect(spy).toHaveBeenCalledWith('nuevo contenido')
})

  it('should initialize codemirror on ngAfterViewInit if editor is visible', () => {
    const spy = jest.spyOn(component, 'initializeCodeMirror');
    component.isEditorChallengeVisible = true;
    component.editorSolution = { nativeElement: document.createElement('div') };
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should not initialize codemirror on ngAfterViewInit if editor is not visible', () => {
    const spy = jest.spyOn(component, 'initializeCodeMirror');
    component.isEditorChallengeVisible = false;
    component.ngAfterViewInit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit solutionChanged and call solutionService on editor update', () => {
    const solutionChangedSpy = jest.spyOn(component.solutionChanged, 'emit');
    const solutionServiceSpy = jest.spyOn(component['solutionService'], 'solutionText');
    
    component.isEditorChallengeVisible = true;
    fixture.detectChanges();
    component.initializeCodeMirror();

    const newContent = 'new solution';
    const transaction = component['editor'].state.update({
      changes: { from: 0, to: component['editor'].state.doc.length, insert: newContent }
    });
    component['editor'].dispatch(transaction);

    expect(solutionChangedSpy).toHaveBeenCalledWith(newContent);
    expect(solutionServiceSpy).toHaveBeenCalledWith(newContent);
  });

})
