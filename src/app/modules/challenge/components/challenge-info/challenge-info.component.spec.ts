import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChallengeInfoComponent } from './challenge-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
import { ChallengeService } from '../../../../services/challenge.service';
import { of } from 'rxjs';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SolutionComponent } from '../../../../shared/components/solution/solution.component';
import { ResourceCardComponent } from '../../../../shared/components/resource-card/resource-card.component';
import { ChallengeCardComponent } from '../../../../shared/components/challenge-card/challenge-card.component';
import { AuthService } from 'src/app/services/auth.service';
import { RestrictedModalComponent } from 'src/app/modules/modals/restricted-modal/restricted-modal.component';

describe('ChallengeInfoComponent', () => {
  let component: ChallengeInfoComponent;
  let fixture: ComponentFixture<ChallengeInfoComponent>;
  let challengeService: ChallengeService;
  let modalService: NgbModal;

  beforeEach(async () => {
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
        ChallengeService,
        AuthService,
        NgbModal
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeInfoComponent);
    component = fixture.componentInstance;
    challengeService = TestBed.inject(ChallengeService);
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadRelatedChallenge with the provided related_id', () => {
      const loadRelatedChallengeSpy = spyOn(component, 'loadRelatedChallenge');
      component.related_id = '123';
      component.ngOnInit();

      expect(loadRelatedChallengeSpy).toHaveBeenCalledTimes(1);
      expect(loadRelatedChallengeSpy).toHaveBeenCalledWith('123');
    });
  });

  describe('ngAfterContentChecked', () => {
    beforeEach(() => {
      // Configurar valores fijos en localStorage
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('refreshToken', 'mock-token');
    });

    afterEach(() => {
      // Limpiar localStorage después de las pruebas
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    });

    it('should set isLogged to true when tokens are present', () => {
      component.ngAfterContentChecked();
      expect(component.isLogged).toBeTruthy();
    });

    it('should set isLogged to false when tokens are not present', () => {
      // Limpiar tokens para esta prueba
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      component.ngAfterContentChecked();
      expect(component.isLogged).toBeFalsy();
    });
  });

  // describe('getRelated', () => {
  //   it('should call challengeService.getRelated with the related_id', () => {
  //     const getRelatedSpy = spyOn(challengeService, 'getRelated').and.returnValue(of({}));
  //     component.related_id = '123';
  //     component.getRelated();

  //     expect(getRelatedSpy).toHaveBeenCalledTimes(1);
  //     expect(getRelatedSpy).toHaveBeenCalledWith('123');
  //   });
  // });

  it('should call getRelated from challengeService and set the response to related', () => {
    const response = [{id: '1'}, {id: '2'}];
    component.related_id = '123';
    spyOn(challengeService, 'getRelated').and.returnValue(of(response));

    component.getRelated();

    setTimeout(() => {
        expect(challengeService.getRelated).toHaveBeenCalledWith('123');
        expect(component.related).toEqual(response);
        done();
    }, 0);
});

//   it('should call getRelated from challengeService and set the response to related', () => {
//     const response = [{id: '1'}, {id: '2'}];
//     spyOn(challengeService, 'getRelated').and.returnValue(of(response));

//     component.ngOnInit();
//     fixture.detectChanges();

//     expect(challengeService.getRelated).toHaveBeenCalledWith('challenge');
//     expect(component.related).toEqual(response);
// });
});
function done() {
  throw new Error('Function not implemented.');
}

