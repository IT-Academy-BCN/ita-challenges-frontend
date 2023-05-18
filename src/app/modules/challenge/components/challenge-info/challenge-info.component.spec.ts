import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeInfoComponent } from './challenge-info.component';

describe('ChallengeInfoComponent', () => {
  let component: ChallengeInfoComponent;
  let fixture: ComponentFixture<ChallengeInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengeInfoComponent]
    });
    fixture = TestBed.createComponent(ChallengeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
