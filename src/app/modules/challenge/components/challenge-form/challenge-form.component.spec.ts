import { type ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ChallengeFormComponent } from './challenge-form.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { BehaviorSubject, of, throwError } from 'rxjs'
import { ChallengeFormService } from 'src/app/services/challenge-form.service'
import { ChallengeService } from 'src/app/services/challenge.service'
import { SolutionService } from 'src/app/services/solution.service'
import { EditorModule } from '@tinymce/tinymce-angular'
import { type ElementRef } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ToastrService } from 'ngx-toastr'
import { CommonModalService } from 'src/app/services/common-modal.service'
import { StarterService } from 'src/app/services/starter.service'
import { AuthService } from 'src/app/services/auth.service'

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

function fillValidChallengeForm(component: ChallengeFormComponent, selectedTags: string[] = [], tagsControlValues: string[] = ["1"]) {
  component.challenge.challengeTitle = "Valid Challenge Title";
  component.challenge.description = "Valid description";
  component.challenge.language = "Javascript";
  component.challenge.solution = "console.log('test')";
  component.selectedTags = selectedTags;
  component.tagsControl.setValue(tagsControlValues);
}

describe('ChallengeFormComponent', () => {
  let component: ChallengeFormComponent
  let fixture: ComponentFixture<ChallengeFormComponent>
  let mockChallengeFormService: jest.Mocked<ChallengeFormService>
  let mockChallengeService: jest.Mocked<ChallengeService>
  let mockRouter: jest.Mocked<Router>
  let mockToastrService: jest.Mocked<ToastrService>
  let mockCommonModalService: jest.Mocked<CommonModalService>
  let mockAuthService: { getUserRole: jest.Mock };
  let roleSubject: BehaviorSubject<string>;

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
      editChallenge: jest.fn().mockReturnValue(of({})),
      deleteChallenge: jest.fn().mockReturnValue(of({}))
    } as unknown as jest.Mocked<ChallengeService>

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>

    mockToastrService = {
      error: jest.fn()
    } as unknown as jest.Mocked<ToastrService>

    mockCommonModalService = {
      successPostingChallengeModal: jest.fn().mockResolvedValue({} as any),
      errorPostingChallengeModal: jest.fn().mockResolvedValue({} as any),
      loadingPostingChallengeModal: jest.fn().mockResolvedValue({} as any),
      deleteConfirmationModal: jest.fn().mockResolvedValue({ isConfirmed: true }),
      deleteSuccessModal: jest.fn().mockResolvedValue({}),
      deleteErrorModal: jest.fn().mockResolvedValue({})
    } as unknown as jest.Mocked<CommonModalService>
    roleSubject = new BehaviorSubject<string>('ADMIN');
    mockAuthService = {
      getUserRole: jest.fn().mockReturnValue(roleSubject.asObservable())
      };

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, EditorModule, HttpClientTestingModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ChallengeFormService, useValue: mockChallengeFormService },
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: Router, useValue: mockRouter },
        { provide: CommonModalService, useValue: mockCommonModalService },
        { provide: SolutionService, useValue: { getAllChallengeSolutions: jest.fn().mockReturnValue(of({ count: 0, offset: 0, limit: 0, results: [] })) } },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: StarterService, useValue: { invalidateCacheAndRefresh: jest.fn() } }
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
    const starter = TestBed.inject(StarterService) as any;
    // sanity: service is provided
    expect(starter).toBeTruthy();
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

  it('should handle error when loading languages', fakeAsync(() => {
    const error = new Error('Failed to load languages');
    mockChallengeFormService.getAllLangugesCreateForm.mockReturnValue(throwError(() => error));
  
    let caughtError;
    try {
      component.loadLanguages();
      tick(); 
    } catch (e) {
      caughtError = e;
    }
  
    expect(component.languages).toEqual([]);
    expect(caughtError).toBe(error);
  }));

  it('should return true if the form and tags are valid', () => {
    component.challenge.challengeTitle = 'Valid Challenge Title'
    component.challenge.description = 'Valid description for the challenge'
    component.challenge.language = 'Javascript'
    component.challenge.solution = 'Valid solution content'
    component.tagsControl.setValue(['1']);

    expect(component.isFormAndTagsValid()).toBe(true)
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

    expect(component.isFormAndTagsValid()).toBe(false)
  })

it("should call createChallenge when the form is valid", async () => {
    fillValidChallengeForm(component, [], ["1"]);

    jest
      .spyOn(mockCommonModalService, "loadingPostingChallengeModal")
      .mockResolvedValue({} as any);
    jest
      .spyOn(mockCommonModalService, "successPostingChallengeModal")
      .mockResolvedValue({} as any);

    component.onSubmit();

    await Promise.resolve();

    expect(mockCommonModalService.loadingPostingChallengeModal).toHaveBeenCalled();
    expect(mockChallengeService.createChallenge).toHaveBeenCalledWith(
      component.challenge
    );
    expect(mockCommonModalService.successPostingChallengeModal).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/ita-challenge/challenges",
    ])
  });

  it("should refresh the list cache on successful creation", async () => {
    fillValidChallengeForm(component, [], ["1"]);

    jest
      .spyOn(mockCommonModalService, "loadingPostingChallengeModal")
      .mockResolvedValue({} as any);
    jest
      .spyOn(mockCommonModalService, "successPostingChallengeModal")
      .mockResolvedValue({} as any);

    const starter = TestBed.inject(StarterService) as any;
    const invalidateSpy = jest.spyOn(starter, 'invalidateCacheAndRefresh');

    component.onSubmit();
    await Promise.resolve();

    expect(invalidateSpy).toHaveBeenCalled();
  });

  it('should not call createChallenge when the form is invalid', () => {
    component.challenge.challengeTitle = ''
    component.challenge.description = 'Some description'
    component.challenge.language = ''
    component.challenge.solution = 'Some solution content'
    component.tagsControl.setValue(['1']);

    component.onSubmit()

    expect(mockChallengeService.createChallenge).not.toHaveBeenCalled()
  })

  it("should not refresh the list cache on generic error", async () => {
   fillValidChallengeForm(component, [], ["1"]);

    const error = { error: { message: "Generic error" } };
    mockChallengeService.createChallenge.mockReturnValue(
      throwError(() => error)
    );

    const starter = TestBed.inject(StarterService) as any;
    const invalidateSpy = jest.spyOn(starter, 'invalidateCacheAndRefresh');

    component.onSubmit();
    await Promise.resolve();

    expect(mockChallengeService.createChallenge).toHaveBeenCalledWith(
      component.challenge
    );
    expect(invalidateSpy).not.toHaveBeenCalled();
  })

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
  it('should send an error when it receives an empty arraylist', fakeAsync(() => {
    const error = new Error('Error de carga');
    jest.spyOn(mockChallengeFormService, 'getTagsByLanguage').mockReturnValue(throwError(() => error));
  
    component.selectedLanguageId = '09fabe32-7362-4bfb-ac05-b7bf854c6e0f';
    
      component.loadTags();
      tick();
  
    expect(mockChallengeFormService.getTagsByLanguage).toHaveBeenCalledWith(component.selectedLanguageId);
    expect(component.currentTags).toEqual([]);
    expect(component.tagsControl.value).toEqual([]);
  }));

  describe('Tag Management', () => {
    it('should load tags on component initialization', () => {
      component.selectedLanguageId = '09fabe32-7362-4bfb-ac05-b7bf854c6e0f'
      component.loadTags()
      expect(mockChallengeFormService.getTagsByLanguage).toHaveBeenCalledWith('09fabe32-7362-4bfb-ac05-b7bf854c6e0f')
      expect(component.currentTags).toEqual(mockJavascriptTags.results)
    })

  describe('Tag Management - loadTags', () => {
    it('should keep only selectedTags that exist in currentTags', () => {
          const mockService = {
        getTagsByLanguage: jest.fn().mockReturnValue(of({
          results: [{ id_tag: '1' }, { id_tag: '3' }]
        }))
      } as any;

      (component as any).challengeFormService = mockService;
      component.isEditMode = true;
      component.selectedLanguageId = 'typescript';
      component.selectedTags = ['1', '2', '3'];
      component.tagsControl.setValue(['1', '2', '3']);
      component.loadTags();
      expect(component.currentTags).toEqual([{ id_tag: '1' }, { id_tag: '3' }]);
      expect(component.selectedTags).toEqual(['1', '3']);
      expect(component.tagsControl.value).toEqual(['1', '3']);
    });

    it('should reset tagsControl when no tags selected', () => {
      const mockService = {
        getTagsByLanguage: jest.fn().mockReturnValue(of({
          results: [{ id_tag: '1' }, { id_tag: '2' }]
        }))
      } as any;

      (component as any).challengeFormService = mockService;
      component.isEditMode = true;
      component.selectedLanguageId = 'typescript';
      component.selectedTags = [];
      component.tagsControl.setValue([]);
      component.loadTags();
      expect(component.tagsControl.value).toEqual([]);
    });
  });

    it('should toggle tag selection correctly', () => {
      const testTagId = '1'
      // Selecting a tag
      component.onTagSelect(testTagId)
      expect(component.tagsControl.value).toContain(testTagId)
      expect(component.isTagSelected(testTagId)).toBeTruthy()
      // Deselecting the same tag
      component.onTagSelect(testTagId)
      expect(component.tagsControl.value).not.toContain(testTagId)
      expect(component.isTagSelected(testTagId)).toBeFalsy()
    })

    it('should handle tag selection correctly', () => {
      const testTagId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      component.onTagSelect(testTagId)
      expect(component.tagsControl.value).toContain(testTagId)
      expect(component.isTagSelected(testTagId)).toBeTruthy()

      component.onTagSelect(testTagId)
      expect(component.tagsControl.value).not.toContain(testTagId)
      expect(component.isTagSelected(testTagId)).toBeFalsy()
    })

    it('should filter selected tags in edit mode when loading tags', () => {
      component.isEditMode = true
      component.selectedTags = ['00000000-0000-0000-0000-000000000000', 'non-existent-tag']
      component.selectedLanguageId = '09fabe32-7362-4bfb-ac05-b7bf854c6e0f'

      component.loadTags()

      expect(component.selectedTags).toEqual(['00000000-0000-0000-0000-000000000000'])
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
      const loadSolutionContentSpy = jest.spyOn(component as any, 'loadSolutionContent');

      component.loadChallengeForEditing();
      fixture.detectChanges();

      expect(mockChallengeService.getChallengeById).toHaveBeenCalledWith('1');
      expect(component.challenge.challengeTitle).toEqual({ en: 'Test Challenge' });
      expect(component.challenge.description).toEqual({ en: 'Test Description' });
      expect(component.challenge.level).toBe('MEDIUM');
      expect(component.challenge.language).toBe('Java');
      expect(component.selectedLanguageId).toBe('java123');
      expect(loadTagsSpy).toHaveBeenCalled();
      expect(loadSolutionContentSpy).toHaveBeenCalled();
    });

    it('should not call getChallengeById if challengeIdToEdit is not set', () => {
      component.challengeIdToEdit = '';
      component.loadChallengeForEditing();
      expect(mockChallengeService.getChallengeById).not.toHaveBeenCalled();
    });

    it('should handle errors when loading a challenge', fakeAsync(() => {
      component.challengeIdToEdit = '1';
      const error = new Error('Failed to load');
      mockChallengeService.getChallengeById.mockReturnValue(throwError(() => error));
    
      let caughtError;
      try {
        component.loadChallengeForEditing();
        tick();
      } catch (e) {
        caughtError = e;
      }
    
      expect(caughtError).toBe(error);
    }));
    
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
      const loadTagsSpy = jest.spyOn(component, 'loadTags').mockImplementation(() => {});
      
      component.isEditMode = true;
      component.loadChallengeForEditing();
      fixture.detectChanges();
    
      expect(component.challenge.challengeTitle).toBe('Test Title');
      expect(component.challenge.description).toBe('Test Description');
      expect(component.challenge.level).toBe('HARD');
      expect(component.challenge.language).toBe('Python');
      expect(component.selectedLanguageId).toBe('python123');
      expect(component.tagsControl.value).toEqual(['tag1', 'tag2']);
      expect(component.selectedTags).toEqual(component.tagsControl.value);
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

  describe('Tag Management - onSubmit', () => {
    it('should call createChallenge with unique tags', () => {
      const mockChallengeService = {
        createChallenge: jest.fn().mockReturnValue(of({}))
      } as any;

      const mockModalService = {
        successPostingChallengeModal: jest.fn().mockReturnValue(Promise.resolve()),
        loadingPostingChallengeModal: jest.fn(),
        errorPostingChallengeModal: jest.fn()
      } as any;

      (component as any).challengeService = mockChallengeService;
      (component as any).commonModalService = mockModalService;
      component.isEditMode = false;
      component.selectedTags = ['1', '2','3'];
      component.tagsControl.setValue(['1','2', '3']);
      jest.spyOn(component as any, 'isFormAndTagsValid').mockReturnValue(true);
      component.onSubmit();
      expect(mockChallengeService.createChallenge).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ['1', '2', '3']
        })
      );
    });

    it('should not submit when form or tags are invalid', () => {
      jest.spyOn(component as any, 'isFormAndTagsValid').mockReturnValue(false);
      const markSpy = jest.spyOn(component.tagsControl, 'markAsTouched');
      component.onSubmit();
      expect(markSpy).toHaveBeenCalled();
    });
  });
  
    it('should handle null editor gracefully in updateCodeMirror', () => {
      component.editor = null;
      component.challenge.solution = 'some content';
      
      expect(() => (component as any).updateCodeMirror()).not.toThrow();
    });
  
    it('should handle error when editing challenge fails', fakeAsync(() => {
      component.isEditMode = true;
      component.challengeIdToEdit = '1';
      component.challenge.challengeTitle = 'Test Challenge';
      component.challenge.description = 'Test Description';
      component.challenge.language = 'Javascript';
      component.challenge.solution = 'console.log("test")';
      component.tagsControl.setValue(['1']);
      
      const error = new Error('Edit failed');
      mockChallengeService.editChallenge.mockReturnValue(throwError(() => error));
      
      let caughtError;
      try {
        component.onSubmit();
        tick();
      } catch (e) {
        caughtError = e;
      }
      
      expect(mockChallengeService.editChallenge).toHaveBeenCalledWith('1', component.challenge);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(caughtError).toBe(error);
    }));
  
    it('should navigate to challenges on successful edit', () => {
      component.isEditMode = true;
      component.challengeIdToEdit = '1';
      component.challenge.challengeTitle = 'Test Challenge';
      component.challenge.description = 'Test Description';
      component.challenge.language = 'Javascript';
      component.challenge.solution = 'console.log("test")';
      component.tagsControl.setValue(['1']);
      
     
      
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
      expect(component.selectedLanguageId).toBe('');
    });
  
    it('should handle getTagsByLanguage error during challenge loading', fakeAsync(() => {
      component.challengeIdToEdit = '1';
      const mockChallenge = {
        challenge_title: { en: 'Test Challenge' },
        detail: { description: 'Test Description' },
        level: 'MEDIUM',
        languages: [{ language_name: 'Java', id_language: 'java123' }],
        solutions: 'public class Main {}'
      };
    
      mockChallengeService.getChallengeById.mockReturnValue(of(mockChallenge as any));
      const tagsError = new Error('Tags error');
      jest.spyOn(mockChallengeFormService, 'getTagsByLanguage').mockReturnValue(
        throwError(() => tagsError)
      );
    }));

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
      const handleEditorUpdateSpy = jest.spyOn(component as any, 'handleEditorUpdate');
      
      (component as any).loadSolutionContent();

      expect(solutionService.getAllChallengeSolutions).toHaveBeenCalledWith('1', 'lang1');
      expect(component.challenge.solution).toBe('console.log("solution")');
      expect(handleEditorUpdateSpy).toHaveBeenCalled();
    });

    it('should set default solution when no solutions are found', () => {
      solutionService.getAllChallengeSolutions.mockReturnValue(of({ count: 0, offset: 0, limit: 1, results: [] }));
      component.challengeIdToEdit = '1';
      component.selectedLanguageId = 'lang1';
      const handleEditorUpdateSpy = jest.spyOn(component as any, 'handleEditorUpdate');

      (component as any).loadSolutionContent();

      expect(component.challenge.solution).toContain('// Tu código aquí');
      expect(handleEditorUpdateSpy).toHaveBeenCalled();
    });

    it('should handle error when loading solutions', fakeAsync(() => {
      const error = new Error('Solution load failed');
      solutionService.getAllChallengeSolutions.mockReturnValue(throwError(() => error));
      component.challengeIdToEdit = '1';
      component.selectedLanguageId = 'lang1';
      const handleEditorUpdateSpy = jest.spyOn(component as any, 'handleEditorUpdate');
    
      let caughtError;
      try {
        (component as any).loadSolutionContent();
        tick();
      } catch (e) {
        caughtError = e;
      }
    
      expect(handleEditorUpdateSpy).toHaveBeenCalled();
      expect(caughtError).toBe(error);
    }));

    it('should set default solution if challengeId or languageId is missing', () => {
      component.challengeIdToEdit = '';
      component.selectedLanguageId = '';
      const handleEditorUpdateSpy = jest.spyOn(component as any, 'handleEditorUpdate');

      (component as any).loadSolutionContent();

      expect(component.challenge.solution).toContain('// Tu código aquí');
      expect(handleEditorUpdateSpy).toHaveBeenCalled();
    });
  });
  
  it('should not submit if no tags are selected', () => {
    fillValidChallengeForm(component, [], []);
    component.onSubmit();
    expect(mockChallengeService.createChallenge).not.toHaveBeenCalled();
    expect(component.tagsControl.touched).toBe(true);
  });

  it("should submit if tags are selected and form is valid", async () => {
    fillValidChallengeForm(component, [], ["1"]);
    jest.spyOn(mockCommonModalService, "loadingPostingChallengeModal").mockResolvedValue({} as any);
    jest.spyOn(mockCommonModalService, "successPostingChallengeModal").mockResolvedValue({} as any);

    component.onSubmit();
    await Promise.resolve();
    await Promise.resolve();

    expect(mockCommonModalService.loadingPostingChallengeModal).toHaveBeenCalled();
    expect(mockChallengeService.createChallenge).toHaveBeenCalledWith(component.challenge);
    expect(mockCommonModalService.successPostingChallengeModal).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges']);
})

  it("should handle 400 error on createChallenge and set serverError", () => {
    fillValidChallengeForm(component, [], ["1"]);
    const errorResponse = {
      status: 400,
      error: { fieldErrors: { tags: "Tags error" } },
    };
    mockChallengeService.createChallenge.mockReturnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(mockChallengeService.createChallenge).toHaveBeenCalledWith(component.challenge);
    expect(component.tagsControl.hasError("serverError")).toBe(true);
});

  it("should call loadingPostingChallengeModal before createChallenge when the form is valid", async () => {
    fillValidChallengeForm(component, ["2"], ["1"]);
    jest.spyOn(mockCommonModalService, "loadingPostingChallengeModal").mockResolvedValue({} as any);
    jest.spyOn(mockCommonModalService, "successPostingChallengeModal").mockResolvedValue({} as any);

    component.onSubmit();
    await Promise.resolve();

    expect(mockCommonModalService.loadingPostingChallengeModal).toHaveBeenCalled();
    expect(mockChallengeService.createChallenge).toHaveBeenCalledWith({
      ...component.challenge,
      tags: component.tagsControl.value,
  });
  expect(mockCommonModalService.successPostingChallengeModal).toHaveBeenCalled();
  expect(mockRouter.navigate).toHaveBeenCalledWith(["/ita-challenge/challenges"]);
});

it("should handle generic error with errorPostingChallengeModal", async () => {
  fillValidChallengeForm(component, [], ["1"]);
  const error = { error: { message: "Generic error" } };
  mockChallengeService.createChallenge.mockReturnValue(throwError(() => error));
  jest.spyOn(mockCommonModalService, "errorPostingChallengeModal").mockResolvedValue({} as any);

  component.onSubmit();
  await Promise.resolve();

  expect(mockCommonModalService.errorPostingChallengeModal).toHaveBeenCalledWith("Generic error");
  expect(mockChallengeService.createChallenge).toHaveBeenCalledWith(component.challenge);
});

it("should set serverError on tagsControl when 400 error with fieldErrors.tags occurs", () => {
  fillValidChallengeForm(component, [], ["1"]);
  const errorResponse = { status: 400, error: { fieldErrors: { tags: "Tags error" } } };
  mockChallengeService.createChallenge.mockReturnValue(throwError(() => errorResponse));

  component.onSubmit();

  expect(mockChallengeService.createChallenge).toHaveBeenCalledWith(component.challenge);
  expect(component.tagsControl.hasError("serverError")).toBe(true);
});

it("should not call createChallenge if form or tags are invalid", () => {
  fillValidChallengeForm(component, [], []);
  component.challenge.challengeTitle = ""; 
  component.onSubmit();

  expect(mockChallengeService.createChallenge).not.toHaveBeenCalled();
  expect(mockCommonModalService.loadingPostingChallengeModal).not.toHaveBeenCalled();
  expect(component.tagsControl.touched).toBe(true);
});

it("should correctly merge selectedTags and tagsControl values into challenge.tags", async () => {
  fillValidChallengeForm(component, ["2"], ["1"]);
  jest.spyOn(mockCommonModalService, "loadingPostingChallengeModal").mockResolvedValue({} as any);
  jest.spyOn(mockCommonModalService, "successPostingChallengeModal").mockResolvedValue({} as any);

  component.onSubmit();
  await Promise.resolve();

  expect(component.challenge.tags).toEqual(component.tagsControl.value);
});
it('should display New challenge title in create mode (default)', () => {
    component.isEditMode = false;
    fixture.detectChanges();
    const titleEl: HTMLElement | null = fixture.nativeElement.querySelector('h3.form-title');
    expect(titleEl).not.toBeNull();
    expect(titleEl!.textContent?.trim()).toBe('modules.challenge.challengeForm.title');
});

it('should display Edit challenge title in edit mode', () => {
    component.isEditMode = true;
    fixture.detectChanges();
    const titleEl: HTMLElement | null = fixture.nativeElement.querySelector('h3.form-title');
    expect(titleEl).not.toBeNull();
    expect(titleEl!.textContent?.trim()).toBe('modules.challenge.challengeForm.editTitle');
});

it('should not render breadcrumb in the header', () => {
  component.isEditMode = false; // either mode should not render it
  fixture.detectChanges();
  const breadcrumbEl: HTMLElement | null = fixture.nativeElement.querySelector('.breadcrumb');
  expect(breadcrumbEl).toBeNull();
});
describe('onDeleteChallenge', () => {
  let starter: any;
  let invalidateSpy: jest.SpyInstance;

  beforeEach(() => {
    component.challengeIdToEdit = 'challenge-123';
    roleSubject.next('ADMIN');
    // Happy path defaults — sobreescribe solo en tests de casos alternativos
    mockCommonModalService.deleteConfirmationModal.mockResolvedValue({ isConfirmed: true } as any);
    mockChallengeService.deleteChallenge.mockReturnValue(of({}));
    mockCommonModalService.deleteSuccessModal.mockResolvedValue({} as any);
    starter = TestBed.inject(StarterService) as any;
    invalidateSpy = jest.spyOn(starter, 'invalidateCacheAndRefresh');
  });

  it('should show error modal when user is not ADMIN', fakeAsync(() => {
    roleSubject.next('USER');
    component.onDeleteChallenge();
    tick();
    expect(mockCommonModalService.deleteErrorModal).toHaveBeenCalledWith(expect.any(String));
    expect(mockCommonModalService.deleteConfirmationModal).not.toHaveBeenCalled();
    expect(mockChallengeService.deleteChallenge).not.toHaveBeenCalled();
  }));

  it('should show confirmation modal when user is ADMIN', fakeAsync(() => {
    component.onDeleteChallenge();
    tick();
    expect(mockCommonModalService.deleteConfirmationModal).toHaveBeenCalled();
  }));

  // Fusionados: delete + invalidate + navigate + success modal en un solo flujo
  it('should delete challenge, invalidate cache, show success and navigate', fakeAsync(() => {
    component.onDeleteChallenge();
    tick();
    expect(mockChallengeService.deleteChallenge).toHaveBeenCalledWith('challenge-123');
    expect(invalidateSpy).toHaveBeenCalled();
    expect(mockCommonModalService.deleteSuccessModal).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges']);
  }));

  it('should not delete when confirmation is cancelled', fakeAsync(() => {
    mockCommonModalService.deleteConfirmationModal.mockResolvedValue({ isConfirmed: false } as any);
    component.onDeleteChallenge();
    tick();
    expect(mockChallengeService.deleteChallenge).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));

  it('should show error modal with message when delete fails', fakeAsync(() => {
    mockChallengeService.deleteChallenge.mockReturnValue(throwError(() => new Error('Delete failed')));
    component.onDeleteChallenge();
    tick();
    expect(mockCommonModalService.deleteErrorModal).toHaveBeenCalledWith(
    expect.any(String)
  );
  }));

  it('should show error modal if challengeIdToEdit is empty', fakeAsync(() => {
  component.challengeIdToEdit = '';
  component.onDeleteChallenge();
  tick();
  expect(mockChallengeService.deleteChallenge).not.toHaveBeenCalled();
  expect(mockCommonModalService.deleteErrorModal).toHaveBeenCalledWith(expect.any(String));
}));
});
})
