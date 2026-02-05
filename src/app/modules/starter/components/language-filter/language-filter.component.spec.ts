import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError, } from 'rxjs';
import { LanguageFilterComponent } from './language-filter.component';
import { ChallengeFormService} from 'src/app/services/challenge-form.service';
import { Language } from 'src/app/models/language.model';

// Define API response type
interface ApiResponse {
    results: Language[] | null;
}

describe('LanguageFilterComponent', () => {
  let component: LanguageFilterComponent;
  let fixture: ComponentFixture<LanguageFilterComponent>;
  let mockChallengeService: jest.Mocked<ChallengeFormService>;

  const mockLanguages: Language[] = [
    { id_language: '1', language_name: 'JavaScript' },
    { id_language: '2', language_name: 'Python' },
    { id_language: '3', language_name: 'Java' },
    { id_language: '4', language_name: 'PHP' },
  ];


  const apiLanguages: Language[] = [
    { id_language: '5', language_name: 'TypeScript' },
    { id_language: '6', language_name: 'Go' },
    { id_language: '7', language_name: 'Rust' },
  ];

  beforeEach(async () => {
    // Create mock with proper typing
    mockChallengeService = {
      getAllLanguages: jest.fn().mockReturnValue(of({ results: null }))
    } as any;

    await TestBed.configureTestingModule({
      declarations: [LanguageFilterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ChallengeFormService, useValue: mockChallengeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageFilterComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ========================================
  // BASIC TESTS
  // ========================================
  describe('Component Creation', () => {
    
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have languageSelected EventEmitter', () => {
      expect(component.languageSelected).toBeDefined();
    });
  });

  // ========================================
  // INITIALIZATION TESTS - API SUCCESS
  // ========================================
  describe('Initialization with API Success', () => {
    
    it('should initialize with mock languages before API call', () => {
      expect(component.languages).toEqual(mockLanguages);
      expect(component.languages.length).toBe(4);
    });

    it('should create form with mock languages in constructor', () => {
      expect(component.languageForm).toBeDefined();
      const controlKeys = Object.keys(component.languageForm.controls);
      expect(controlKeys).toContain('javascript');
      expect(controlKeys).toContain('python');
      expect(controlKeys).toContain('java');
      expect(controlKeys).toContain('php');
    });

    it('should update languages when API returns valid data', (done) => {
      // Mock with proper type
      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        of({ results: apiLanguages })
      );

      fixture.detectChanges();

      setTimeout(() => {
        expect(component.languages).toEqual(apiLanguages);
        expect(component.languages.length).toBe(3);
        expect(component.languages).not.toEqual(mockLanguages);
        done();
      }, 100);
    });

    it('should recreate form controls when API returns valid data', (done) => {
      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        of({ results: apiLanguages })
      );

      fixture.detectChanges();

      setTimeout(() => {
        const controlKeys = Object.keys(component.languageForm.controls);
        expect(controlKeys).toContain('typescript');
        expect(controlKeys).toContain('go');
        expect(controlKeys).toContain('rust');
        expect(controlKeys).not.toContain('javascript');
        expect(controlKeys).not.toContain('python');
        done();
      }, 100);
    });

    it('should initialize all new form controls with false', (done) => {
      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        of({ results: apiLanguages })
      );

      fixture.detectChanges();

      setTimeout(() => {
        Object.keys(component.languageForm.controls).forEach(key => {
          expect(component.languageForm.get(key)?.value).toBe(false);
        });
        done();
      }, 100);
    });

    it('should call getAllLangugesCreateForm on ngOnInit', () => {
      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        of({ results: apiLanguages })
      );

      fixture.detectChanges();

      expect(mockChallengeService.getAllLangugesCreateForm).toHaveBeenCalled();
      expect(mockChallengeService.getAllLangugesCreateForm).toHaveBeenCalledTimes(1);
    });
  });

  // ========================================
  // INITIALIZATION TESTS - API FAILURE
  // ========================================
  describe('Initialization with API Failure', () => {

    it('should keep mock languages when API returns empty array', (done) => {
      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        of({ results: [] })
      );

      fixture.detectChanges();

      setTimeout(() => {
        expect(component.languages).toEqual(mockLanguages);
        done();
      }, 100);
    });

    it('should keep mock languages when API throws error', (done) => {
      const errorResponse = { status: 500, message: 'Server Error' };
      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        throwError(() => errorResponse)
      );

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      fixture.detectChanges();

      setTimeout(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error Fetching languages, using mocking data:', 
          errorResponse
        );

        expect(component.languages).toEqual(mockLanguages);
        
        consoleErrorSpy.mockRestore();
        done();
      }, 100);
    });

    it('should handle network error gracefully', (done) => {
      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        throwError(() => new Error('Network Error'))
      );

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      fixture.detectChanges();

      setTimeout(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(component.languages).toEqual(mockLanguages);
        
        consoleErrorSpy.mockRestore();
        done();
      }, 100);
    });

    it('should keep original form controls when API returns null', (done) => {
      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        of({ results: [] })
      );

      const initialControlKeys = Object.keys(component.languageForm.controls);

      fixture.detectChanges();

      setTimeout(() => {
        const currentControlKeys = Object.keys(component.languageForm.controls);
        
        expect(currentControlKeys).toEqual(initialControlKeys);
        expect(currentControlKeys).toContain('javascript');
        expect(currentControlKeys).toContain('python');
        done();
      }, 100);
    });

    it('should keep original form controls when API throws error', (done) => {
      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        throwError(() => new Error('Network Error'))
      );

      jest.spyOn(console, 'error').mockImplementation();

      const initialControlKeys = Object.keys(component.languageForm.controls);

      fixture.detectChanges();

      setTimeout(() => {
        const currentControlKeys = Object.keys(component.languageForm.controls);
        
        expect(currentControlKeys).toEqual(initialControlKeys);
        done();
      }, 100);
    });
  });

  // ========================================
  // STRING ARRAY EMISSION TESTS
  // ========================================
  describe('String Array Emission on Interaction', () => {
    
    beforeEach((done) => {
      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        of({ results: [] })
      );
      fixture.detectChanges();
      setTimeout(done, 50);
    });

    it('should emit empty array when no checkboxes are selected', (done) => {
      let emittedValue: string[] | undefined;

      component.languageSelected.subscribe((languages: string[]) => {
        emittedValue = languages;
      });

      component.emitSelectedLanguages(component.languageForm);

      setTimeout(() => {
        expect(emittedValue).toEqual([]);
        expect(emittedValue?.length).toBe(0);
        done();
      }, 50);
    });

    it('should emit array with one language when one checkbox is selected', (done) => {
      let emittedValue: string[] | undefined;

      component.languageSelected.subscribe((languages: string[]) => {
        emittedValue = languages;
      });

      component.languageForm.get('javascript')?.setValue(true);

      setTimeout(() => {
        expect(emittedValue).toEqual(['javascript']);
        expect(emittedValue?.length).toBe(1);
        done();
      }, 50);
    });

    it('should emit array with multiple languages when multiple checkboxes are selected', (done) => {
      let emittedValue: string[] | undefined;

      component.languageSelected.subscribe((languages: string[]) => {
        emittedValue = languages;
      });

      component.languageForm.get('javascript')?.setValue(true);
      component.languageForm.get('python')?.setValue(true);
      component.languageForm.get('java')?.setValue(true);

      setTimeout(() => {
        expect(emittedValue?.length).toBe(3);
        expect(emittedValue).toContain('javascript');
        expect(emittedValue).toContain('python');
        expect(emittedValue).toContain('java');
        done();
      }, 50);
    });

    it('should only emit selected languages (excluding unchecked)', (done) => {
      let emittedValue: string[] | undefined;

      component.languageSelected.subscribe((languages: string[]) => {
        emittedValue = languages;
      });

      component.languageForm.get('javascript')?.setValue(true);
      component.languageForm.get('python')?.setValue(false);
      component.languageForm.get('java')?.setValue(true);
      component.languageForm.get('php')?.setValue(false);

      setTimeout(() => {
        expect(emittedValue?.length).toBe(2);
        expect(emittedValue).toContain('javascript');
        expect(emittedValue).toContain('java');
        expect(emittedValue).not.toContain('python');
        expect(emittedValue).not.toContain('php');
        done();
      }, 50);
    });

    it('should emit updated array when checkbox is unchecked', (done) => {
      let emittedValue: string[] | undefined;

      component.languageSelected.subscribe((languages: string[]) => {
        emittedValue = languages;
      });

      component.languageForm.get('javascript')?.setValue(true);
      component.languageForm.get('python')?.setValue(true);

      setTimeout(() => {
        expect(emittedValue?.length).toBe(2);

        component.languageForm.get('javascript')?.setValue(false);

        setTimeout(() => {
          expect(emittedValue?.length).toBe(1);
          expect(emittedValue).toEqual(['python']);
          expect(emittedValue).not.toContain('javascript');
          done();
        }, 50);
      }, 50);
    });

    it('should emit correct array after multiple interactions', (done) => {
      let emittedValue: string[] | undefined;

      component.languageSelected.subscribe((languages: string[]) => {
        emittedValue = languages;
      });

      component.languageForm.get('javascript')?.setValue(true);
      
      setTimeout(() => {
        expect(emittedValue).toEqual(['javascript']);

        component.languageForm.get('python')?.setValue(true);

        setTimeout(() => {
          expect(emittedValue?.length).toBe(2);

          component.languageForm.get('javascript')?.setValue(false);

          setTimeout(() => {
            expect(emittedValue).toEqual(['python']);

            component.languageForm.get('java')?.setValue(true);
            component.languageForm.get('php')?.setValue(true);

            setTimeout(() => {
              expect(emittedValue?.length).toBe(3);
              expect(emittedValue).toContain('python');
              expect(emittedValue).toContain('java');
              expect(emittedValue).toContain('php');
              done();
            }, 50);
          }, 50);
        }, 50);
      }, 50);
    });

    it('should automatically emit on form value changes', (done) => {
      let emissionCount = 0;
      let lastEmittedValue: string[] | undefined;

      component.languageSelected.subscribe((languages: string[]) => {
        emissionCount++;
        lastEmittedValue = languages;
      });

      component.languageForm.get('javascript')?.setValue(true);

      setTimeout(() => {
        expect(emissionCount).toBeGreaterThan(0);
        expect(lastEmittedValue).toContain('javascript');
        done();
      }, 50);
    });

    it('should emit lowercase language names', (done) => {
      let emittedValue: string[] | undefined;

      component.languageSelected.subscribe((languages: string[]) => {
        emittedValue = languages;
      });

      component.languageForm.get('javascript')?.setValue(true);
      component.languageForm.get('python')?.setValue(true);

      setTimeout(() => {
        emittedValue?.forEach(lang => {
          expect(lang).toBe(lang.toLowerCase());
        });
        done();
      }, 50);
    });
  });

  // ========================================
  // CREATEFORMFROMLANGUAGES() TESTS
  // ========================================
  describe('createFormFromLanguages() method', () => {
    
    it('should create a FormGroup with controls for each language', () => {
      const testLanguages: Language[] = [
        { id_language: '1', language_name: 'C++' },
        { id_language: '2', language_name: 'Ruby' },
      ];

      const form = component.createFormFromLanguages(testLanguages);

      expect(form).toBeDefined();
      expect(Object.keys(form.controls).length).toBe(2);
      expect(form.get('c++')).toBeDefined();
      expect(form.get('ruby')).toBeDefined();
    });

    it('should initialize all form controls with false value', () => {
      const form = component.createFormFromLanguages(mockLanguages);

      Object.keys(form.controls).forEach(key => {
        expect(form.get(key)?.value).toBe(false);
      });
    });

    it('should convert language names to lowercase for control names', () => {
      const testLanguages: Language[] = [
        { id_language: '1', language_name: 'JavaScript' },
        { id_language: '2', language_name: 'PYTHON' },
      ];

      const form = component.createFormFromLanguages(testLanguages);

      expect(form.get('javascript')).toBeDefined();
      expect(form.get('python')).toBeDefined();
      expect(form.get('JavaScript')).toBeNull();
      expect(form.get('PYTHON')).toBeNull();
    });

    it('should handle empty language array', () => {
      const form = component.createFormFromLanguages([]);

      expect(form).toBeDefined();
      expect(Object.keys(form.controls).length).toBe(0);
    });

    it('should subscribe to valueChanges', (done) => {
      const emitSpy = jest.spyOn(component, 'emitSelectedLanguages');
      const form = component.createFormFromLanguages(mockLanguages);
      
      form.get('javascript')?.setValue(true);

      setTimeout(() => {
        expect(emitSpy).toHaveBeenCalled();
        done();
      }, 50);
    });
  });

  // ========================================
  // INTEGRATION TESTS
  // ========================================
  describe('Integration: API Response + Emission', () => {
    
    it('should emit correct languages after API loads new data', (done) => {
      let emittedValue: string[] | undefined;

      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        of({ results: apiLanguages })
      );

      component.languageSelected.subscribe((languages: string[]) => {
        emittedValue = languages;
      });

      fixture.detectChanges();

      setTimeout(() => {
        expect(component.languageForm.get('typescript')).toBeDefined();
        expect(component.languageForm.get('go')).toBeDefined();

        component.languageForm.get('typescript')?.setValue(true);
        component.languageForm.get('rust')?.setValue(true);

        setTimeout(() => {
          expect(emittedValue?.length).toBe(2);
          expect(emittedValue).toContain('typescript');
          expect(emittedValue).toContain('rust');
          expect(emittedValue).not.toContain('javascript');
          done();
        }, 50);
      }, 100);
    });

    it('should maintain emission functionality after API error', (done) => {
      let emittedValue: string[] | undefined;

      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        throwError(() => new Error('API Error'))
      );

      jest.spyOn(console, 'error').mockImplementation();

      component.languageSelected.subscribe((languages: string[]) => {
        emittedValue = languages;
      });

      fixture.detectChanges();

      setTimeout(() => {
        component.languageForm.get('javascript')?.setValue(true);
        component.languageForm.get('python')?.setValue(true);

        setTimeout(() => {
          expect(emittedValue?.length).toBe(2);
          expect(emittedValue).toContain('javascript');
          expect(emittedValue).toContain('python');
          done();
        }, 50);
      }, 100);
    });
  });

  // ========================================
  // EDGE CASES
  // ========================================
  describe('Edge Cases', () => {
    
    beforeEach((done) => {
      mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
        of({ results: [] })
      );
      fixture.detectChanges();
      setTimeout(done, 50);
    });

    it('should handle rapid consecutive value changes', (done) => {
      let lastEmittedValue: string[] | undefined;

      component.languageSelected.subscribe((languages: string[]) => {
        lastEmittedValue = languages;
      });

      component.languageForm.get('javascript')?.setValue(true);
      component.languageForm.get('python')?.setValue(true);
      component.languageForm.get('javascript')?.setValue(false);
      component.languageForm.get('java')?.setValue(true);

      setTimeout(() => {
        expect(lastEmittedValue).toContain('python');
        expect(lastEmittedValue).toContain('java');
        expect(lastEmittedValue).not.toContain('javascript');
        done();
      }, 100);
    });

    it('should handle setting same value multiple times', (done) => {
      let emissionCount = 0;

      component.languageSelected.subscribe(() => {
        emissionCount++;
      });

      const initialCount = emissionCount;

      component.languageForm.get('javascript')?.setValue(true);
      component.languageForm.get('javascript')?.setValue(true);
      component.languageForm.get('javascript')?.setValue(true);

      setTimeout(() => {
        expect(emissionCount).toBeGreaterThan(initialCount);
        done();
      }, 100);
    });

    it('should handle special characters in language names', () => {
      const specialLanguages: Language[] = [
        { id_language: '1', language_name: 'C++' },
        { id_language: '2', language_name: 'C#' },
      ];

      const form = component.createFormFromLanguages(specialLanguages);

      expect(form.get('c++')).toBeDefined();
      expect(form.get('c#')).toBeDefined();
    });
  });
});