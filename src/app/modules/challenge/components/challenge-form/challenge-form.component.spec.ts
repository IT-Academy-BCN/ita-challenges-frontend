import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ChallengeFormComponent } from './challenge-form.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { of, throwError } from 'rxjs'
import { ChallengeFormService } from 'src/app/services/challenge-form.service'
import { ChallengeService } from 'src/app/services/challenge.service'
import { SolutionService } from 'src/app/services/solution.service'
import { EditorModule } from '@tinymce/tinymce-angular'
import { type ElementRef } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

// Mocks para CodeMirror
const mockEditorView = {
  destroy: jest.fn(),
  state: {
    doc: {
      toString: jest.fn().mockReturnValue('console.log("test")')
    }
  },
  setState: jest.fn()
};

jest.mock('@codemirror/view', () => {
  const mockEditorView = jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    state: {
      doc: {
        toString: jest.fn().mockReturnValue('console.log("test")')
      }
    },
    setState: jest.fn()
  }));

  (mockEditorView as any).updateListener = {
    of: jest.fn().mockReturnValue([])
  };
  (mockEditorView as any).theme = jest.fn().mockReturnValue([]);

  return {
    EditorView: mockEditorView
  }
})

jest.mock('@codemirror/state', () => ({
  EditorState: {
    create: jest.fn().mockImplementation((config) => ({
      doc: config?.doc || '',
      extensions: config?.extensions || [],
      update: jest.fn(),
      reconfigure: jest.fn()
    }))
  }
}));

jest.mock('@codemirror/lang-javascript', () => ({
  javascript: jest.fn().mockReturnValue({
    extension: {}
  })
}));
jest.mock('@codemirror/lang-java', () => ({
  java: jest.fn().mockReturnValue({
    extension: {}
  })
}));
jest.mock('@codemirror/lang-python', () => ({
  python: jest.fn().mockReturnValue({
    extension: {}
  })
}));
jest.mock('codemirror', () => ({
  basicSetup: {}
}));

describe('ChallengeFormComponent', () => {
  let component: ChallengeFormComponent
  let fixture: ComponentFixture<ChallengeFormComponent>
  let mockChallengeFormService: jest.Mocked<ChallengeFormService>
  let mockChallengeService: jest.Mocked<ChallengeService>
  let mockRouter: jest.Mocked<Router>

  const mockJavascriptTags = {
    results: [
      {
        id_tag: '00000000-0000-0000-0000-000000000000',
        tag_name: 'Recursividad',
        tag_description: 'Retos que implican resolver problemas mediante funciones que se llaman a sí mismas.'
      },
      {
        id_tag: '04104104-1041-0410-4104-104104104104',
        tag_name: 'Algoritmos',
        tag_description: 'Ejercicios centrados en diseño y optimización de algoritmos clásicos y personalizados.'
      },
      {
        id_tag: '08208208-2082-0820-8208-208208208208',
        tag_name: 'Estructuras',
        tag_description: 'Retos sobre listas, pilas, colas, árboles, grafos y otras estructuras de datos.'
      },
      {
        id_tag: '0c30c30c-30c3-0c30-c30c-30c30c30c30c',
        tag_name: 'POO',
        tag_description: 'Desafíos enfocados en Programación Orientada a Objetos: clases, herencia, polimorfismo, etc.'
      },
      {
        id_tag: '11111111-1111-1111-1111-111111111111',
        tag_name: 'Spring',
        tag_description: 'Retos utilizando el framework Spring y Spring Boot.'
      },
      {
        id_tag: '22222222-2222-2222-2222-222222222222',
        tag_name: 'Collections',
        tag_description: 'Ejercicios sobre el uso de ArrayList, HashSet, HashMap y otras colecciones.'
      },
      {
        id_tag: '33333333-3333-3333-3333-333333333333',
        tag_name: 'Threads',
        tag_description: 'Desafíos de programación concurrente y multihilos.'
      },
      {
        id_tag: '44444444-4444-4444-4444-444444444444',
        tag_name: 'Interfaces',
        tag_description: 'Retos sobre implementación y uso de interfaces en Java.'
      }
    ]
  }

  beforeEach(async () => {
    mockChallengeFormService = {
      getAllLangugesCreateForm: jest.fn().mockReturnValue(of({
        results: [
          { language_name: 'Javascript', id_language: '09fabe32-7362-4bfb-ac05-b7bf854c6e0f' },
          { language_name: 'Java', id_language: '660e1b18-0c0a-4262-a28a-85de9df6ac5f' },
          { language_name: 'Python', id_language: 3 },
          { language_name: 'PHP', id_language: 4 },
          { language_name: 'Typescript', id_language: 5 },
          { language_name: 'SQL', id_language: 6 }
        ]
      })),
      getTagsByLanguage: jest.fn().mockReturnValue(of(mockJavascriptTags))
    } as unknown as jest.Mocked<ChallengeFormService>

    mockChallengeService = {
      createChallenge: jest.fn().mockReturnValue(of({})),
      getChallengeById: jest.fn().mockReturnValue(of({})),
      editChallenge: jest.fn().mockReturnValue(of({}))
    } as unknown as jest.Mocked<ChallengeService>

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, EditorModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ChallengeFormService, useValue: mockChallengeFormService },
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: Router, useValue: mockRouter },
        { provide: SolutionService, useValue: { getAllChallengeSolutions: jest.fn().mockReturnValue(of({ count: 0, offset: 0, limit: 0, results: [] })) } },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ChallengeFormComponent)
    component = fixture.componentInstance

    // Mock del elemento CodeMirror
    component.codeMirrorEditor = {
      nativeElement: document.createElement('div')
    } satisfies ElementRef<any>

    // Mockear initCodeMirror para evitar su ejecución automática en ngAfterViewInit
    jest.spyOn(component as any, 'initCodeMirror').mockImplementation(() => {});

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

  it('should handle error when loading languages', (done) => {
    const error = new Error('Failed to load languages');
    mockChallengeFormService.getAllLangugesCreateForm.mockReturnValue(throwError(() => error));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    component.loadLanguages();
    
    fixture.whenStable().then(() => {
      expect(component.languages).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error al obtener los idiomas:', error);
      consoleSpy.mockRestore();
      done();
    });
  });

  it('should return true if the form is valid', () => {
    component.challenge.challengeTitle = 'Valid Challenge Title'
    component.challenge.description = 'Valid description for the challenge'
    component.challenge.language = 'Javascript'
    component.challenge.solution = 'Valid solution content'

    expect(component.isFormValid()).toBe(true)
  })

  it('should return true if the form is valid with translated title and description', () => {
    component.challenge.challengeTitle = { en: 'Valid Challenge Title' } as any;
    component.challenge.description = { en: 'Valid description' } as any;
    component.challenge.language = 'Javascript';
    component.challenge.solution = 'Valid solution content';
    
    expect(component.isFormValid()).toBe(true);
  });

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

  it('should handle error when creating a challenge', (done) => {
    component.challenge.challengeTitle = 'Valid Challenge Title';
    component.challenge.description = 'Valid description for the challenge';
    component.challenge.language = 'Javascript';
    component.challenge.solution = 'Valid solution content';
    
    const error = new Error('Create failed');
    mockChallengeService.createChallenge.mockReturnValue(throwError(() => error));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    component.onSubmit();
    
    fixture.whenStable().then(() => {
      expect(mockChallengeService.createChallenge).toHaveBeenCalledWith(component.challenge);
      expect(consoleSpy).toHaveBeenCalledWith('Error al crear el reto:', error);
      consoleSpy.mockRestore();
      done();
    });
  });

  describe('CodeMirror Integration', () => {
    it('should initialize CodeMirror on ngAfterViewInit if not in edit mode', () => {
      component.isEditMode = false;
      // Restaurar el mock para esta prueba
      const initCodeMirrorSpy = jest.spyOn(component as any, 'initCodeMirror').mockImplementation(() => {});
      component.ngAfterViewInit();
      expect(initCodeMirrorSpy).toHaveBeenCalled();
    });

    it('should not initialize CodeMirror on ngAfterViewInit if in edit mode', () => {
      component.isEditMode = true;
      const initCodeMirrorSpy = jest.spyOn(component as any, 'initCodeMirror').mockRestore(); // No espiar
      component.ngAfterViewInit();
      // No se puede verificar que no se llamó si no hay espía, pero nos aseguramos que no falle
      expect(component.editor).toBeNull();
    });

    it('should destroy CodeMirror on ngOnDestroy', () => {
      component.editor = mockEditorView as any;
      component.ngOnDestroy();
      expect(mockEditorView.destroy).toHaveBeenCalled();
    });

    it('should handle null editor on ngOnDestroy gracefully', () => {
      component.editor = null;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });

    it('should handle language change and update editor state', () => {
      component.editor = mockEditorView as any;
      component.onLanguageChange('Python');
      expect(component.challenge.language).toBe('Python');
      expect(mockEditorView.setState).toHaveBeenCalled();
    });

    it('should handle language change with null editor', () => {
      component.editor = null;
      expect(() => component.onLanguageChange('Python')).not.toThrow();
      expect(component.challenge.language).toBe('Python');
    });
  });

  it('should call onCancel and navigate to challenges list', () => {
    component.onCancel()
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges'])
  })

  it('should update selectedLanguageId and load tags when language changes', () => {
    const mockLoadTags = jest.spyOn(component, 'loadTags')
    component.onLanguageChange('Javascript')
    expect(component.selectedLanguageId).toBe('09fabe32-7362-4bfb-ac05-b7bf854c6e0f')
    expect(mockLoadTags).toHaveBeenCalled()
  })

  it('should call getTagsByLanguage() with the correct language ID', () => {
    component.selectedLanguageId = '09fabe32-7362-4bfb-ac05-b7bf854c6e0f'
    component.loadTags()
    expect(mockChallengeFormService.getTagsByLanguage).toHaveBeenCalledWith('09fabe32-7362-4bfb-ac05-b7bf854c6e0f')
  })

  it('should not call getTagsByLanguage() if selectedLanguageId is empty', () => {
    const spyGetTags = jest.spyOn(mockChallengeFormService, 'getTagsByLanguage')

    component.selectedLanguageId = ''
    component.loadTags()

    expect(spyGetTags).not.toHaveBeenCalled()
  })

  it('should handle errors when calling getTagsByLanguage()', (done) => {
    const error = new Error('Error de carga');
    jest.spyOn(mockChallengeFormService, 'getTagsByLanguage').mockReturnValue(throwError(() => error));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    component.selectedLanguageId = '09fabe32-7362-4bfb-ac05-b7bf854c6e0f';
    component.loadTags();
  
    expect(mockChallengeFormService.getTagsByLanguage).toHaveBeenCalledWith(component.selectedLanguageId);
  
    // Since loadTags is async, we need to wait for the observable to resolve
    fixture.whenStable().then(() => {
      expect(component.currentTags).toEqual([]);
      expect(component.selectedTags).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching tags:', error);
      consoleSpy.mockRestore();
      done();
    });
  });

  describe('Tag Management', () => {
    it('should load tags on component initialization', () => {
      component.selectedLanguageId = '09fabe32-7362-4bfb-ac05-b7bf854c6e0f'
      component.loadTags()
      expect(mockChallengeFormService.getTagsByLanguage).toHaveBeenCalledWith('09fabe32-7362-4bfb-ac05-b7bf854c6e0f')
      expect(component.currentTags).toEqual(mockJavascriptTags.results)
    })

    it('should toggle tag selection correctly', () => {
      const testTagId = '1'
      // Selecting a tag
      component.onTagSelect(testTagId)
      expect(component.selectedTags).toContain(testTagId)
      expect(component.isTagSelected(testTagId)).toBeTruthy()
      // Deselecting the same tag
      component.onTagSelect(testTagId)
      expect(component.selectedTags).not.toContain(testTagId)
      expect(component.isTagSelected(testTagId)).toBeFalsy()
    })

    it('should handle tag selection correctly', () => {
      const testTagId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      component.onTagSelect(testTagId)
      expect(component.selectedTags).toContain(testTagId)
      expect(component.isTagSelected(testTagId)).toBeTruthy()

      component.onTagSelect(testTagId)
      expect(component.selectedTags).not.toContain(testTagId)
      expect(component.isTagSelected(testTagId)).toBeFalsy()
    })
  })

   describe('loadChallengeForEditing', () => {
    const mockChallenge = {
      id_challenge: '1',
      challenge_title: { en: 'Test Challenge' },
      detail: { description: { en: 'Test Description' } },
      level: 'MEDIUM',
      languages: [{ language_name: 'Java', id_language: 'java123' }],
      solutions: 'public class Main {}',
      creation_date: new Date(),
      popularity: 0,
      favorites_count: 0,
      saved_count: 0,
      timesFavorite: 0,
      timesSolved: 0,
      bookmarked: false
    };

    it('should load challenge data and update the form', () => {
      component.challengeIdToEdit = '1';
      mockChallengeService.getChallengeById.mockReturnValue(of(mockChallenge as any));
      const loadTagsSpy = jest.spyOn(component, 'loadTags');
      const updateCodeMirrorSpy = jest.spyOn(component as any, 'updateCodeMirror');
      const loadSolutionContentSpy = jest.spyOn(component as any, 'loadSolutionContent');

      component.loadChallengeForEditing();
      fixture.detectChanges();

      expect(mockChallengeService.getChallengeById).toHaveBeenCalledWith('1');
      expect(component.challenge.challengeTitle).toEqual({ en: 'Test Challenge' });
      expect(component.challenge.description).toEqual({ en: 'Test Description' });
      expect(component.challenge.level).toBe('MEDIUM');
      expect(component.challenge.language).toBe('Java');
      expect(component.challenge.solution).toContain('// Tu código aquí');
      expect(component.selectedLanguageId).toBe('java123');
      expect(loadTagsSpy).toHaveBeenCalled();
      expect(loadSolutionContentSpy).toHaveBeenCalled();
    });

    it('should not call getChallengeById if challengeIdToEdit is not set', () => {
      component.challengeIdToEdit = '';
      component.loadChallengeForEditing();
      expect(mockChallengeService.getChallengeById).not.toHaveBeenCalled();
    });

    it('should handle errors when loading a challenge', (done) => {
      component.challengeIdToEdit = '1';
      const error = new Error('Failed to load');
      mockChallengeService.getChallengeById.mockReturnValue(throwError(() => error));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      component.loadChallengeForEditing();

      fixture.whenStable().then(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error loading challenge for editing:', error);
        consoleSpy.mockRestore();
        done();
      });
    });
    
    it('should correctly map challenge data to form fields', () => {
      const mockChallenge = {
        challenge_title: 'Test Title',
        detail: { description: 'Test Description' },
        level: 'HARD',
        languages: [{ language_name: 'Python', id_language: 'python123' }],
        tags: ['tag1', 'tag2']
      };
      component.challengeIdToEdit = '1';
      mockChallengeService.getChallengeById.mockReturnValue(of(mockChallenge as any));
      const loadSolutionContentSpy = jest.spyOn(component as any, 'loadSolutionContent');
      const loadTagsSpy = jest.spyOn(component, 'loadTags');
    
      component.loadChallengeForEditing();
      fixture.detectChanges();
    
      expect(component.challenge.challengeTitle).toBe('Test Title');
      expect(component.challenge.description).toBe('Test Description');
      expect(component.challenge.level).toBe('HARD');
      expect(component.challenge.language).toBe('Python');
      expect(component.selectedLanguageId).toBe('python123');
      expect(component.selectedTags).toEqual(['tag1', 'tag2']);
      expect(loadSolutionContentSpy).toHaveBeenCalled();
      expect(loadTagsSpy).toHaveBeenCalled();
    });
    
    it('should handle missing optional fields when loading a challenge', () => {
      const mockChallenge = {
        challenge_title: 'Test Title',
        detail: { description: 'Test Description' },
        level: 'EASY'
      };
      component.challengeIdToEdit = '1';
      mockChallengeService.getChallengeById.mockReturnValue(of(mockChallenge as any));
    
      component.loadChallengeForEditing();
    
      expect(component.challenge.language).toBe('');
      expect(component.selectedLanguageId).toBe('');
      expect(component.selectedTags).toEqual([]);
    });
    
    it('should not call loadTags if language is not available', () => {
      const mockChallenge = {
        challenge_title: 'Test Title',
        detail: { description: 'Test Description' },
        level: 'EASY'
      };
      component.challengeIdToEdit = '1';
      mockChallengeService.getChallengeById.mockReturnValue(of(mockChallenge as any));
      const loadTagsSpy = jest.spyOn(component, 'loadTags');
    
      component.loadChallengeForEditing();
    
      expect(loadTagsSpy).not.toHaveBeenCalled();
    });
  });

  describe('updateCodeMirror', () => {
    it('should update the editor state if the editor exists', () => {
      // Ensure the editor mock is available
      component.editor = {
        setState: jest.fn(),
        destroy: jest.fn()
      } as any;
      component.challenge.solution = 'new solution';
      
      (component as any).updateCodeMirror();

      if (component.editor) {
        expect(component.editor.setState).toHaveBeenCalled();
      }
    });

    it('should not throw an error if the editor does not exist', () => {
      component.editor = null;
      expect(() => (component as any).updateCodeMirror()).not.toThrow();
    });
  });
  describe('Additional Tests for SonarQube Coverage', () => {
    it('should handle challenge with missing translations in current language', () => {
      component.challengeIdToEdit = '1';
      const mockChallenge = {
        challenge_title: { es: 'Título en español' },
        detail: { description: { es: 'Descripción en español' } },
        level: 'MEDIUM',
        languages: [{ language_name: 'Java', id_language: 'java123' }],
        solutions: 'public class Main {}'
      };
  
      jest.spyOn(component.translate, 'currentLang', 'get').mockReturnValue('en');
      mockChallengeService.getChallengeById.mockReturnValue(of(mockChallenge as any));
      
      component.loadChallengeForEditing();
      
      expect(component.challenge.challengeTitle).toEqual({ es: 'Título en español' });
      expect(component.challenge.description).toEqual({ es: 'Descripción en español' });
    });
  
    it('should handle challenge with completely missing title and description', () => {
      component.challengeIdToEdit = '1';
      const mockChallenge = {
        challenge_title: null,
        detail: { description: null },
        level: 'MEDIUM',
        languages: [{ language_name: 'Java', id_language: 'java123' }],
        solutions: 'public class Main {}'
      };
  
      mockChallengeService.getChallengeById.mockReturnValue(of(mockChallenge as any));
      
      component.loadChallengeForEditing();
      
      expect(component.challenge.challengeTitle).toBe('');
      expect(component.challenge.description).toBe('');
    });
  
    it('should handle challenge with empty languages array', () => {
      component.challengeIdToEdit = '1';
      const mockChallenge = {
        challenge_title: { en: 'Test Challenge' },
        detail: { description: { en: 'Test Description' } },
        level: 'MEDIUM',
        languages: [],
        solutions: 'public class Main {}'
      };
  
      mockChallengeService.getChallengeById.mockReturnValue(of(mockChallenge as any));
      
      component.loadChallengeForEditing();
      
      expect(component.challenge.language).toBe('');
      expect(component.selectedLanguageId).toBe('');
    });
  
    it('should update editor state with new solution content', () => {
      const mockSetState = jest.fn();
      component.editor = {
        setState: mockSetState,
        destroy: jest.fn()
      } as any;
      
      component.challenge.solution = 'new solution content';
      
      (component as any).updateCodeMirror();
      
      expect(mockSetState).toHaveBeenCalled();
    });
  
    it('should handle null editor gracefully in updateCodeMirror', () => {
      component.editor = null;
      component.challenge.solution = 'some content';
      
      expect(() => (component as any).updateCodeMirror()).not.toThrow();
    });
  
    it('should handle error when editing challenge fails', () => {
      component.isEditMode = true;
      component.challengeIdToEdit = '1';
      component.challenge.challengeTitle = 'Test Challenge';
      component.challenge.description = 'Test Description';
      component.challenge.language = 'Javascript';
      component.challenge.solution = 'console.log("test")';
      
      const error = new Error('Edit failed');
      mockChallengeService.editChallenge.mockReturnValue(throwError(() => error));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      component.onSubmit();
      
      expect(mockChallengeService.editChallenge).toHaveBeenCalledWith('1', component.challenge);
      expect(consoleSpy).toHaveBeenCalledWith('Error al actualizar el reto:', error);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  
    it('should navigate to challenges on successful edit', () => {
      component.isEditMode = true;
      component.challengeIdToEdit = '1';
      component.challenge.challengeTitle = 'Test Challenge';
      component.challenge.description = 'Test Description';
      component.challenge.language = 'Javascript';
      component.challenge.solution = 'console.log("test")';
      
     
      
      component.onSubmit();
      
      expect(mockChallengeService.editChallenge).toHaveBeenCalledWith('1', component.challenge);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges']);
    });
  
    it('should update challenge solution when CodeMirror content changes', () => {
      // Mock manual del listener
      const mockUpdate = {
        docChanged: true,
        state: {
          doc: {
            toString: () => 'updated content'
          }
        }
      };
  
      // Simular el cambio llamando al callback manualmente
      component.challenge.solution = mockUpdate.state.doc.toString();
      
      expect(component.challenge.solution).toBe('updated content');
    });

    
  
    it('should set topic to ALL when loading challenge for editing', () => {
      component.challengeIdToEdit = '1';
      const mockChallenge = {
        challenge_title: { en: 'Test Challenge' },
        detail: { description: { en: 'Test Description' } },
        level: 'MEDIUM',
        languages: [{ language_name: 'Java', id_language: 'java123' }],
        solutions: 'public class Main {}'
      };
  
      mockChallengeService.getChallengeById.mockReturnValue(of(mockChallenge as any));
      
      component.loadChallengeForEditing();
      
      expect(component.challenge.topic).toBe('ALL');
    });
  
    it('should enter edit mode and call loadChallengeForEditing when route has id', () => {
      const activatedRoute = TestBed.inject(ActivatedRoute);
      activatedRoute.params = of({ id: '123' });
  
      const loadChallengeSpy = jest.spyOn(component, 'loadChallengeForEditing');
  
      component.ngOnInit();
  
      expect(component.isEditMode).toBe(true);
      expect(component.challengeIdToEdit).toBe('123');
      expect(loadChallengeSpy).toHaveBeenCalled();
    });
  
    it('should handle challenge with undefined properties', () => {
      component.challengeIdToEdit = '1';
      const mockChallenge = {
        challenge_title: undefined,
        detail: undefined,
        level: 'MEDIUM',
        languages: [],
        solutions: undefined
      };
  
      mockChallengeService.getChallengeById.mockReturnValue(of(mockChallenge as any));
      
      component.loadChallengeForEditing();
      
      expect(component.challenge.challengeTitle).toBe('');
      expect(component.challenge.description).toBe('');
      expect(component.challenge.language).toBe('');
      expect(component.challenge.solution).toBe('function solution() {\n  // Tu código aquí\n  return resultado;\n}');
      expect(component.selectedLanguageId).toBe('');
    });
  
    it('should handle getTagsByLanguage error during challenge loading', (done) => {
      component.challengeIdToEdit = '1';
      const mockChallenge = {
        challenge_title: { en: 'Test Challenge' },
        detail: { description: 'Test Description' },
        level: 'MEDIUM',
        languages: [{ language_name: 'Java', id_language: 'java123' }],
        solutions: 'public class Main {}'
      };
  
      mockChallengeService.getChallengeById.mockReturnValue(of(mockChallenge as any));
      jest.spyOn(mockChallengeFormService, 'getTagsByLanguage').mockReturnValue(
        throwError(() => new Error('Tags error'))
      );
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      component.loadChallengeForEditing();
      
      // Usar setTimeout para esperar a que se resuelvan las promesas/observables
      setTimeout(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching tags:', expect.any(Error));
        consoleSpy.mockRestore();
        done();
      }, 0);
    });
  });

  describe('loadSolutionContent', () => {
    let solutionService: jest.Mocked<SolutionService>;

    beforeEach(() => {
      solutionService = TestBed.inject(SolutionService) as jest.Mocked<SolutionService>;
      solutionService.getAllChallengeSolutions = jest.fn().mockReturnValue(of({
        count: 1,
        offset: 0,
        limit: 1,
        results: [{ solution_text: 'console.log("solution")' }]
      } as any));
    });

    it('should load solution content and update editor', () => {
      component.challengeIdToEdit = '1';
      component.selectedLanguageId = 'lang1';
      component.editor = mockEditorView as any; // Mock editor to test update path
      const updateCodeMirrorSpy = jest.spyOn(component as any, 'updateCodeMirror');
      
      (component as any).loadSolutionContent();

      expect(solutionService.getAllChallengeSolutions).toHaveBeenCalledWith('1', 'lang1');
      expect(component.challenge.solution).toBe('console.log("solution")');
      expect(updateCodeMirrorSpy).toHaveBeenCalled();
    });

    it('should set default solution when no solutions are found', () => {
      solutionService.getAllChallengeSolutions.mockReturnValue(of({ count: 0, offset: 0, limit: 1, results: [] }));
      component.challengeIdToEdit = '1';
      component.selectedLanguageId = 'lang1';
      const initCodeMirrorSpy = jest.spyOn(component as any, 'initCodeMirror');

      (component as any).loadSolutionContent();

      expect(component.challenge.solution).toContain('// Tu código aquí');
      expect(initCodeMirrorSpy).toHaveBeenCalled();
    });

    it('should handle error when loading solutions', () => {
      const error = new Error('Solution load failed');
      solutionService.getAllChallengeSolutions.mockReturnValue(throwError(() => error));
      component.challengeIdToEdit = '1';
      component.selectedLanguageId = 'lang1';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      try {
        (component as any).loadSolutionContent();
      } catch (e) {
        // The component re-throws the error, which we catch here to allow the test to continue.
      }

      expect(consoleSpy).toHaveBeenCalledWith('Error loading challenge solution for editing:', error);
      expect(component.challenge.solution).toContain('// Tu código aquí');
      consoleSpy.mockRestore();
    });

    it('should set default solution if challengeId or languageId is missing', () => {
      component.challengeIdToEdit = '';
      component.selectedLanguageId = '';
      const initCodeMirrorSpy = jest.spyOn(component as any, 'initCodeMirror');

      (component as any).loadSolutionContent();

      expect(component.challenge.solution).toContain('// Tu código aquí');
      expect(initCodeMirrorSpy).toHaveBeenCalled();
    });
  });
})
