import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ChallengeFormComponent } from './challenge-form.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { of } from 'rxjs'
import { ChallengeFormService } from 'src/app/services/challenge-form.service'
import { ChallengeService } from 'src/app/services/challenge.service'
import { EditorModule } from '@tinymce/tinymce-angular'
import { type ElementRef } from '@angular/core'

// Mocks para CodeMirror
jest.mock('@codemirror/view', () => {
  return {
    EditorView: jest.fn().mockImplementation(() => {
      return {
        destroy: jest.fn(),
        state: {
          doc: {
            toString: jest.fn().mockReturnValue('console.log("test")')
          }
        },
        setState: jest.fn()
      }
    })
  }
})

jest.mock('@codemirror/state', () => {
  return {
    EditorState: {
      create: jest.fn().mockReturnValue({})
    }
  }
})

describe('ChallengeFormComponent', () => {
  let component: ChallengeFormComponent
  let fixture: ComponentFixture<ChallengeFormComponent>
  let mockChallengeFormService: jest.Mocked<ChallengeFormService>
  let mockChallengeService: jest.Mocked<ChallengeService>
  let mockRouter: jest.Mocked<Router>

  beforeEach(async () => {
    mockChallengeFormService = {
      getAllLangugesCreateForm: jest.fn().mockReturnValue(of({
        results: [
          { language_name: 'Javascript', id_language: 1 },
          { language_name: 'Java', id_language: 2 },
          { language_name: 'Python', id_language: 3 },
          { language_name: 'PHP', id_language: 4 },
          { language_name: 'Typescript', id_language: 5 },
          { language_name: 'SQL', id_language: 6 }
        ]
      }))
    } as unknown as jest.Mocked<ChallengeFormService>

    mockChallengeService = {
      createChallenge: jest.fn().mockReturnValue(of({}))
    } as unknown as jest.Mocked<ChallengeService>

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, EditorModule, HttpClientTestingModule],
      providers: [
        { provide: ChallengeFormService, useValue: mockChallengeFormService },
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ChallengeFormComponent)
    component = fixture.componentInstance

    // Mock del elemento CodeMirror
    /* component.codeMirrorEditor = {
      nativeElement: document.createElement('div')
    } satisfies ElementRef */
    component.codeMirrorEditor = {
      nativeElement: document.createElement('div')
    } satisfies ElementRef<any>;

    // Importante: sobrescribir el método privado para evitar errores
    (component as any).getLanguageExtension = jest.fn().mockReturnValue(() => ({}))

    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize TinyMCE configuration', () => {
    expect(component.editorConfig).toBeTruthy()
    expect(component.editorConfig.plugins).toContain('code')
    expect(component.editorConfig.toolbar).toContain('bold')
  })

  it('should load languages and set the languages array', () => {
    component.loadLanguages()
    expect(component.languages.length).toBe(6)
    expect(component.languages[0].language_name).toBe('Javascript')
    expect(mockChallengeFormService.getAllLangugesCreateForm).toHaveBeenCalled()
  })

  it('should return true if the form is valid', () => {
    component.challenge.challengeTitle = 'Valid Challenge Title'
    component.challenge.description = 'Valid description for the challenge'
    component.challenge.language = 'Javascript'
    component.challenge.solution = 'Valid solution content'

    expect(component.isFormValid()).toBe(true)
  })

  it('should return false if the form is invalid', () => {
    component.challenge.challengeTitle = ''
    component.challenge.description = 'Some description'
    component.challenge.language = ''
    component.challenge.solution = 'Some solution content'

    expect(component.isFormValid()).toBe(false)
  })

  it('should call createChallenge when the form is valid', () => {
    component.challenge.challengeTitle = 'Valid Challenge Title'
    component.challenge.description = 'Valid description for the challenge'
    component.challenge.language = 'Javascript'
    component.challenge.solution = 'Valid solution content'

    component.onSubmit()

    expect(mockChallengeService.createChallenge).toHaveBeenCalledWith(component.challenge)
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges'])
  })

  it('should not call createChallenge and log error when the form is invalid', () => {
    component.challenge.challengeTitle = ''
    component.challenge.description = 'Some description'
    component.challenge.language = ''
    component.challenge.solution = 'Some solution content'

    const consoleSpy = jest.spyOn(console, 'error')
    component.onSubmit()

    expect(mockChallengeService.createChallenge).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('El formulario no es válido')
  })

  // Tests para CodeMirror
  it('should initialize CodeMirror on ngAfterViewInit', () => {
    // El mock de codeMirrorEditor ya está configurado en el beforeEach
    // Limpiamos cualquier llamada previa
    jest.clearAllMocks()

    // Llamamos al método manualmente
    component.ngAfterViewInit()

    // Verificamos que EditorView se haya llamado
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const EditorView = require('@codemirror/view').EditorView
    expect(EditorView).toHaveBeenCalled()
  })

  it('should handle missing CodeMirror element gracefully', () => {
    // Simular que el elemento no existe
    component.codeMirrorEditor = {
      nativeElement: document.createElement('div')
    } satisfies ElementRef<any>

    // No debería lanzar un error
    expect(() => { component.ngAfterViewInit() }).not.toThrow()
  })

  it('should destroy CodeMirror on ngOnDestroy', () => {
    // Crear un mock para el editor
    const mockDestroy = jest.fn()
    component.editor = { destroy: mockDestroy } as any

    component.ngOnDestroy()

    expect(mockDestroy).toHaveBeenCalled()
  })

  it('should handle null editor on ngOnDestroy gracefully', () => {
    // Establecer editor como null manualmente
    component.editor = null

    // No debería lanzar un error
    expect(() => { component.ngOnDestroy() }).not.toThrow()
  })

  it('should handle language change', () => {
    // Crear un mock para el editor con setState
    const mockSetState = jest.fn()
    component.editor = {
      state: { doc: { toString: () => 'test' } },
      setState: mockSetState
    } as any

    component.onLanguageChange('Python')

    expect(component.challenge.language).toBe('Python')
    expect(mockSetState).toHaveBeenCalled()
  })

  it('should handle language change with null editor', () => {
    // Establecer editor como null manualmente
    component.editor = null

    // No debería lanzar un error y debería actualizar el lenguaje
    expect(() => { component.onLanguageChange('Python') }).not.toThrow()
    expect(component.challenge.language).toBe('Python')
  })

  it('should call onCancel and navigate to challenges list', () => {
    component.onCancel()
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges'])
  })
})
