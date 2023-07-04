import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeContainerComponent } from './challenge-container.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ChallengeHeaderComponent } from '../challenge-header/challenge-header.component';
import { ChallengeInfoComponent } from '../challenge-info/challenge-info.component';
import { ChallengeRelatedComponent } from '../challenge-related/challenge-related.component';
import { of } from 'rxjs';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';


describe('ChallengeContainerComponent', () => {
  let component: ChallengeContainerComponent;
  let fixture: ComponentFixture<ChallengeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
                    ChallengeContainerComponent, 
                    ChallengeHeaderComponent,
                    ChallengeInfoComponent,
                    ChallengeRelatedComponent
                  ],
      imports: [
                RouterTestingModule, 
                HttpClientTestingModule, 
                SharedComponentsModule,
                I18nModule
              ],
      providers: [{
        provide : ActivatedRoute, 
        useValue : {
            paramMap :  of(convertToParamMap({idChallenge: '1adfadf21fasdf2-adf'}))
        }
      }] 
    });
    fixture = TestBed.createComponent(ChallengeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and get idChallenge param', () => {
    expect(component).toBeTruthy();
    expect(component.idChallenge).not.toBeNull();
    expect(component.idChallenge).not.toBeUndefined();
    expect(component.idChallenge).not.toHaveLength(0);
    expect(component.idChallenge).not.toContain(' ');
  });

});
