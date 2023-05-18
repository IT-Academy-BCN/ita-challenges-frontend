import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeHeaderComponent } from './challenge-header.component';

describe('ChallengeHeaderComponent', () => {
  let component: ChallengeHeaderComponent;
  let fixture: ComponentFixture<ChallengeHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengeHeaderComponent]
    });
    fixture = TestBed.createComponent(ChallengeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
