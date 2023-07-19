import { SharedComponentsModule } from '../../../../shared/components/shared-components.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeComponent } from './challenge.component';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ChallengeHeaderComponent } from '../challenge-header/challenge-header.component';
import { ChallengeInfoComponent } from '../challenge-info/challenge-info.component';
import { of } from 'rxjs';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

describe('ChallengeComponent', () => {
  let component: ChallengeComponent;
  let fixture: ComponentFixture<ChallengeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
                    ChallengeComponent, 
                    ChallengeHeaderComponent,
                    ChallengeInfoComponent,
                  ],
      imports: [
                RouterTestingModule, 
                HttpClientTestingModule, 
                SharedComponentsModule,
                I18nModule,
                NgbNavModule,
                FormsModule
                ],
      providers: [{
        provide : ActivatedRoute, 
        useValue : {
            paramMap :  of(convertToParamMap({idChallenge: '1adfadf21fasdf2-adf'}))
        }
      }] 
      });
    fixture = TestBed.createComponent(ChallengeComponent);
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