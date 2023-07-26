import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChallengeInfoComponent } from './challenge-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
import { ChallengeService } from '../../../../services/challenge.service';
import { of } from 'rxjs';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SolutionComponent } from '../../../../shared/components/solution/solution.component';
import { ResourceCardComponent } from '../../../../shared/components/resource-card/resource-card.component';
import { ChallengeCardComponent } from '../../../../shared/components/challenge-card/challenge-card.component';

describe('ChallengeInfoComponent', () => {
  let component: ChallengeInfoComponent;
  let fixture: ComponentFixture<ChallengeInfoComponent>;
  let challengeService: ChallengeService;

  beforeEach( async () => {
   await TestBed.configureTestingModule({
      declarations: [
            ChallengeInfoComponent, 
            ResourceCardComponent, 
            ChallengeCardComponent,
            SolutionComponent
      ],
      imports: [
            RouterTestingModule,
            HttpClientTestingModule,
            I18nModule,
            FormsModule,
            NgbNavModule
      ],
      providers: [
        ChallengeService
      ]
    }).compileComponents();
  });
  beforeEach(() => {
                  
    fixture = TestBed.createComponent(ChallengeInfoComponent);
    component = fixture.componentInstance;
    challengeService = TestBed.inject(ChallengeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it ('should call loadRelatedChallenge with the provided related_id', () => {
      const loadRelatedChallengeSpy = spyOn(component, 'loadRelatedChallenge');
      component.related_id ='123';
      component.ngOnInit();

      expect(loadRelatedChallengeSpy).toHaveBeenCalledTimes(1);
      expect(loadRelatedChallengeSpy).toHaveBeenCalledWith('123');

    });
  });


  //TO DO (CUANDO TENGAMOS RELATEDS)

  /*describe('loadRelatedChallenge', () => {

    it('should set the related properties correctly', () => {
      component.related_id = '123';

      const mockChallenge = {
        challenge_title: 'Test title',
        creation_date: new Date(),
        level: 'Easy',
        popularity: 0,
        languages: ['JavaScript', 'Java'], 
      };

      spyOn(challengeService, 'getChallengeById').and.returnValue(of(mockChallenge));
      component.loadRelatedChallenge('123');
      expect(component.related_title).toBe(mockChallenge.challenge_title);
      expect(component.related.related_creation_date).toEqual(mockChallenge.creation_date);
      expect(component.related.related_level).toBe(mockChallenge.level);
      expect(component.related_popularity).toBe(mockChallenge.popularity);
      expect(component.related_languages).toEqual(mockChallenge.languages);
      expect(component.related_id).toBe('123');
    });
  });*/
});