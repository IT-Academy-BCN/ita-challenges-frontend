import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { LanguageFilterComponent } from './language-filter.component';
import { ChallengeFormService } from 'src/app/services/challenge-form.service';

describe('LanguageFilterComponent', () => {
  let component: LanguageFilterComponent;
  let fixture: ComponentFixture<LanguageFilterComponent>;
  let mockChallengeService: jest.Mocked<ChallengeFormService>;

  beforeEach(async () => {
    mockChallengeService = {
      getAllLangugesCreateForm: jest.fn().mockReturnValue(of({ results: [] }))
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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});