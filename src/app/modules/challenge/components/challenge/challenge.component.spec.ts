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
import { ChallengeService } from '../../../../services/challenge.service';

describe('ChallengeContainerComponent', () => {
  let component: ChallengeComponent;
  let fixture: ComponentFixture<ChallengeComponent>;
  let mockChallengeService: any;


  beforeEach(async() => {
    mockChallengeService = {
      getChallengeById: jasmine.createSpy('getChallengeById').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      
      declarations: [
          ChallengeComponent, 
          ChallengeHeaderComponent,
          ChallengeInfoComponent,
      ],
      imports: [
          RouterTestingModule, 
          HttpClientTestingModule, 
          SharedComponentsModule,
          I18nModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ idChallenge: '123' })),
          },
        },
        {
          provide: ChallengeService,
          useValue: mockChallengeService,
        },
      ],
    }).compileComponents();
      });
  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create and get idChallenge param', () => {
    expect(component).toBeTruthy();
    expect(component.idChallenge).not.toBeNull();
    expect(component.idChallenge).not.toBeUndefined();
    expect(component.idChallenge).not.toHaveLength(0);
    expect(component.idChallenge).not.toContain(' ');
  });

  it('should call getChallengeById when loadMasterdata is called', () => {
  
    const challenge = {
      challenge_title: 'Test Challenge',
      creation_date: new Date(),
      level: 'Easy',
      details: {
        description: 'Test Challenge Description',
        examples: [],
        notes: 'Test Challenge Notes',
      },
      related: [],
      resources: [],
      solutions: [],
      popularity: 0,
      languages: [],
    };
    mockChallengeService.getChallengeById.and.returnValue(of(challenge));

    component.loadMasterData('123');

    expect(mockChallengeService.getChallengeById).toHaveBeenCalledWith('123');
  });

  it('should set challenge details when loadMasterdata is called', () => {

    const challenge = {
      challenge_title: 'Test Challenge',
      creation_date: new Date(),
      level: 'Easy',
      details: {
        description: 'Test Challenge Description',
        examples: [],
        notes: 'Test Challenge Notes',
      },
      related: [],
      resources: [],
      solutions: [],
      popularity: 0,
      languages: [],
    };
    mockChallengeService.getChallengeById.and.returnValue(of(challenge));

    component.loadMasterData('123');

    expect(component.title).toBe('Test Challenge');
    expect(component.creation_date).toBeDefined();
    expect(component.level).toBe('Easy');
    expect(component.details.description).toBe('Test Challenge Description');
    expect(component.details.examples).toEqual([]);
    expect(component.details.notes).toBe('Test Challenge Notes');
    expect(component.related).toEqual([]);
    expect(component.resources).toEqual([]);
    expect(component.solutions).toEqual([]);
    expect(component.popularity).toBe(0);
    expect(component.languages).toEqual([]);
  });
;
});