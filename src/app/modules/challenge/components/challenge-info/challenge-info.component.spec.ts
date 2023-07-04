import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChallengeComponent } from './../../../../shared/components/challenge/challenge.component';
import { ResourceComponent } from './../../../../shared/components/resource/resource.component';
import { ChallengeInfoComponent } from './challenge-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ChallengeRelatedComponent } from '../challenge-related/challenge-related.component';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';

describe('ChallengeInfoComponent', () => {
  let component: ChallengeInfoComponent;
  let fixture: ComponentFixture<ChallengeInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
                    ChallengeInfoComponent, 
                    ChallengeInfoComponent, 
                    ResourceComponent, 
                    ChallengeComponent,
                    ChallengeRelatedComponent
                  ],
      imports: [
                RouterTestingModule,
                HttpClientTestingModule, 
                I18nModule
              ]
    });
    fixture = TestBed.createComponent(ChallengeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
