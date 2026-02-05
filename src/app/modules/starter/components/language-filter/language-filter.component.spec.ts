import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LanguageFilterComponent } from './language-filter.component';
import { ChallengeFormService } from 'src/app/services/challenge-form.service';
import { Language } from 'src/app/models/language.model';

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
  ];

  beforeEach(async () => {
    mockChallengeService = {
      getAllLangugesCreateForm: jest.fn().mockReturnValue(of({ results: null }))
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

  // Component Creation
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Initialization - Success
  it('should initialize with mock languages', () => {
    expect(component.languages).toEqual(mockLanguages);
  });

  it('should update languages when API returns valid data', (done) => {
    mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
      of({ results: apiLanguages })
    );

    fixture.detectChanges();

    setTimeout(() => {
      expect(component.languages).toEqual(apiLanguages);
      done();
    }, 100);
  });

  // Initialization - Failure
  it('should keep mock languages when API throws error', (done) => {
    mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    jest.spyOn(console, 'error').mockImplementation();
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.languages).toEqual(mockLanguages);
      done();
    }, 100);
  });

  // Emission Tests
  it('should emit language IDs when checkboxes are selected', (done) => {
    mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
      of({ results: [] })
    );
    
    let emittedValue: string[] | undefined;

    component.languageSelected.subscribe((ids: string[]) => {
      emittedValue = ids;
    });

    fixture.detectChanges();

    setTimeout(() => {
      component.languageForm.get('javascript')?.setValue(true);
      component.languageForm.get('python')?.setValue(true);

      setTimeout(() => {
        expect(emittedValue?.length).toBe(2);
        expect(emittedValue).toContain('1'); // IDs, not names
        expect(emittedValue).toContain('2');
        done();
      }, 50);
    }, 50);
  });

  it('should emit empty array when no checkboxes are selected', (done) => {
    mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
      of({ results: [] })
    );
    
    let emittedValue: string[] | undefined;

    component.languageSelected.subscribe((ids: string[]) => {
      emittedValue = ids;
    });

    fixture.detectChanges();

    setTimeout(() => {
      component.emitSelectedLanguages(component.languageForm);

      setTimeout(() => {
        expect(emittedValue).toEqual([]);
        done();
      }, 50);
    }, 50);
  });

  it('should emit updated IDs when checkbox is unchecked', (done) => {
    mockChallengeService.getAllLangugesCreateForm.mockReturnValue(
      of({ results: [] })
    );
    
    let emittedValue: string[] | undefined;

    component.languageSelected.subscribe((ids: string[]) => {
      emittedValue = ids;
    });

    fixture.detectChanges();

    setTimeout(() => {
      component.languageForm.get('javascript')?.setValue(true);
      component.languageForm.get('python')?.setValue(true);

      setTimeout(() => {
        expect(emittedValue?.length).toBe(2);

        component.languageForm.get('javascript')?.setValue(false);

        setTimeout(() => {
          expect(emittedValue?.length).toBe(1);
          expect(emittedValue).toEqual(['2']); // Only Python's ID
          done();
        }, 50);
      }, 50);
    }, 50);
  });
});