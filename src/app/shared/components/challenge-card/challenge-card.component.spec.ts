import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChallengeCardComponent } from './challenge-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { StarterService } from '../../../services/starter.service';

describe('ChallengeComponent', () => {
  let component: ChallengeCardComponent;
  let fixture: ComponentFixture<ChallengeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeCardComponent ],
      imports: [
                RouterTestingModule,
                HttpClientTestingModule
              ], 
      providers: [ StarterService ]
    })
    .compileComponents();
});

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize input correctly', () => {
   component.title = 'Test title';
   component.languages = ['JavaScript', 'Java'];
   component.creation_date = new Date();
   component.level = 'Medium';
   component.popularity = 100;

   expect(component.title).toEqual('Test title');
   expect(component.languages).toEqual(['JavaScript', 'Java']);
   expect(component.creation_date).toBeDefined();
   expect(component.level).toEqual('Medium');
   expect(component.popularity).toEqual(100);
  });
});
