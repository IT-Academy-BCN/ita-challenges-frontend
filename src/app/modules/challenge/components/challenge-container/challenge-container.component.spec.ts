import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeContainerComponent } from './challenge-container.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('ChallengeContainerComponent', () => {
  let component: ChallengeContainerComponent;
  let fixture: ComponentFixture<ChallengeContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengeContainerComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],  
      });
    fixture = TestBed.createComponent(ChallengeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
