import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeRelatedComponent } from './challenge-related.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedComponentsModule } from '../../../../shared/components/shared-components.module';




describe('ChallengeRelatedComponent', () => {
  let component: ChallengeRelatedComponent;
  let fixture: ComponentFixture<ChallengeRelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeRelatedComponent ],
      imports: [RouterTestingModule,
      HttpClientTestingModule,
      SharedComponentsModule]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ChallengeRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});