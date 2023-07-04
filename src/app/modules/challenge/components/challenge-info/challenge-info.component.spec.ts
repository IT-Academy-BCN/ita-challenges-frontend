import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChallengeComponent } from './../../../../shared/components/challenge/challenge.component';
import { ResourceComponent } from './../../../../shared/components/resource/resource.component';
import { ChallengeInfoComponent } from './challenge-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ChallengeRelatedComponent } from '../challenge-related/challenge-related.component';

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
                HttpClientTestingModule
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
