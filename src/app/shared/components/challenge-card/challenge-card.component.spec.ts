import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChallengeCardComponent } from './challenge-card.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChallengeComponent', () => {
  let component: ChallengeCardComponent;
  let fixture: ComponentFixture<ChallengeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeCardComponent ],
      imports: [RouterTestingModule,
      HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
