import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeContainerComponent } from './challenge-container.component';

describe('ChallengeContainerComponent', () => {
  let component: ChallengeContainerComponent;
  let fixture: ComponentFixture<ChallengeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
