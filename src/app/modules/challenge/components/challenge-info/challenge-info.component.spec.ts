import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChallengeCardComponent } from '../../../../shared/components/challenge-card/challenge-card.component';
import { ResourceCardComponent } from '../../../../shared/components/resource-card/resource-card.component';
import { ChallengeInfoComponent } from './challenge-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';

describe('ChallengeInfoComponent', () => {
  let component: ChallengeInfoComponent;
  let fixture: ComponentFixture<ChallengeInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
                    ChallengeInfoComponent, 
                    ChallengeInfoComponent, 
                    ResourceCardComponent, 
                    ChallengeCardComponent
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