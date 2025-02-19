import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeFormComponent } from './challenge-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Импортирование модуля для тестов HTTP-запросов
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ChallengeFormService } from 'src/app/services/challenge-form.service';
import { EditorModule } from '@tinymce/tinymce-angular';

describe('ChallengeFormComponent', () => {
  let component: ChallengeFormComponent;
  let fixture: ComponentFixture<ChallengeFormComponent>;
  let mockChallengeFormService: jest.Mocked<ChallengeFormService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockChallengeFormService = {
      getAllLangugesCreateForm: jest.fn().mockReturnValue(of({ results: [{ language_name: 'JavaScript', id_language: 1 }] }))
    } as unknown as jest.Mocked<ChallengeFormService>;

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, EditorModule, HttpClientTestingModule],  
      providers: [
        { provide: ChallengeFormService, useValue: mockChallengeFormService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize TinyMCE configuration', () => {
    expect(component.editorConfig).toBeTruthy();
    expect(component.editorConfig.plugins).toContain('code');
    expect(component.editorConfig.toolbar).toContain('bold');
  });

  it('should call ChallengeFormService to load languages', () => {
    component.loadLanguages();
    expect(mockChallengeFormService.getAllLangugesCreateForm).toHaveBeenCalled();
  });



  it('should load languages correctly', () => {
    component.loadLanguages();
    expect(mockChallengeFormService.getAllLangugesCreateForm).toHaveBeenCalled();
    expect(component.languages.length).toBeGreaterThan(0);
    expect(component.languages[0].language_name).toBe('JavaScript');
  });
  

  it('should return true if the form is valid', () => {
    component.challenge.challengeTitle = 'Valid Challenge Title';
    component.challenge.description = 'Valid description for the challenge';
    component.challenge.language = 'JavaScript';
    component.challenge.solution = 'Valid solution content';
  
    expect(component.isFormValid()).toBe(true);
  });
  
  it('should return false if the form is invalid', () => {
    component.challenge.challengeTitle = 'Invalid Challenge Title';
    component.challenge.description = 'Some description';
    component.challenge.language = ''; 
    component.challenge.solution = 'Some solution content';
  

    expect(component.isFormValid()).toBe(false);
  });
  

  
});


