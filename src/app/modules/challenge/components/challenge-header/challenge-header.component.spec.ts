import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeHeaderComponent } from './challenge-header.component';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';

describe('ChallengeHeaderComponent', () => {
  let component: ChallengeHeaderComponent;
  let fixture: ComponentFixture<ChallengeHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeHeaderComponent ],
      imports: [ I18nModule ]
    });
    fixture = TestBed.createComponent(ChallengeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
