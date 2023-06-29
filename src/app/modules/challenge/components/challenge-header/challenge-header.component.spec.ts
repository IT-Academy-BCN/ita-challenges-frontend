import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeHeaderComponent } from './challenge-header.component';
import { SharedComponentsModule } from '../../../../shared/components/shared-components.module'


describe('ChallengeHeaderComponent', () => {
  let component: ChallengeHeaderComponent;
  let fixture: ComponentFixture<ChallengeHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengeHeaderComponent],
      imports: [ SharedComponentsModule]
    });
    fixture = TestBed.createComponent(ChallengeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
