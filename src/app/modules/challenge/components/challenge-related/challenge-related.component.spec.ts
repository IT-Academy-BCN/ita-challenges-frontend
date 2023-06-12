import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeRelatedComponent } from './challenge-related.component';

describe('ChallengeRelatedComponent', () => {
  let component: ChallengeRelatedComponent;
  let fixture: ComponentFixture<ChallengeRelatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengeRelatedComponent]
    });
    fixture = TestBed.createComponent(ChallengeRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
