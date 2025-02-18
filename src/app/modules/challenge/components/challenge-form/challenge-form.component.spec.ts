import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeFormComponent } from './challenge-form.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { of } from 'rxjs';
import { CreateChallenge } from '../../../../models/create-challenge.interface';
import { ChallengeFormService } from 'src/app/services/challenge-form.service';

describe('ChallengeFormComponent', () => {
  let component: ChallengeFormComponent;
  let fixture: ComponentFixture<ChallengeFormComponent>;
  let mockChallengeService: jest.Mocked<ChallengeFormService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockChallengeService = {
      createChallenge: jest.fn(),
      getAllLangugesCreateForm: jest.fn().mockReturnValue(of({ results: [{ language_name: 'JavaScript', id_language: 1 }] }))
    } as unknown as jest.Mocked<ChallengeFormService>;

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, EditorModule, ChallengeFormComponent],  
      providers: [
        { provide: ChallengeFormService, useValue: mockChallengeService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeFormComponent);
    component = fixture.componentInstance;


    if (!component.challenge) {
      component.challenge = {
        challengeTitle: '',
        description: '',
        level: 'EASY',
        language: '',
        solution: ''
      };
    }

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); 
  });

  it('should call ChallengeFormService on valid form submission', () => {
    const mockChallenge: CreateChallenge = {
      challengeTitle: 'Test Challenge',
      description: 'Test Description',
      level: 'EASY',
      language: 'JAVA',  
      solution: 'Test Solution'
    };

    mockChallengeService.createChallenge.mockReturnValue(of({ success: true }));

    component.challenge = mockChallenge;  
    component.onSubmit();

    expect(mockChallengeService.createChallenge).toHaveBeenCalledWith(mockChallenge);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/ita-challenge/challenges']);
  });
});
