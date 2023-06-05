import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChallengeComponent } from './challenge.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChallengeComponent', () => {
  let component: ChallengeComponent;
  let fixture: ComponentFixture<ChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeComponent ],
      imports: [RouterTestingModule,
      HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
