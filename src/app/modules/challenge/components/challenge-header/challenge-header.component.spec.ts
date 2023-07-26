import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
import { ChallengeHeaderComponent } from './challenge-header.component';
import { SendSolutionService } from '../../../../services/send-solution.service';
import { SolutionComponent } from '../../../../shared/components/solution/solution.component';

describe('ChallengeHeaderComponent', () => {
  let component: ChallengeHeaderComponent;
  let fixture: ComponentFixture<ChallengeHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengeHeaderComponent, SolutionComponent],
      imports: [I18nModule],
      providers: [SendSolutionService]
    });
    fixture = TestBed.createComponent(ChallengeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
