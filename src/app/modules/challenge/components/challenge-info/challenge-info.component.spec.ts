import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ChallengeInfoComponent } from './challenge-info.component'
import { RouterTestingModule } from '@angular/router/testing'
import { I18nModule } from '../../../../../assets/i18n/i18n.module'
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'
import { SolutionComponent } from '../../../../shared/components/solution/solution.component'
import { ResourceCardComponent } from '../../../../shared/components/resource-card/resource-card.component'
import { ChallengeCardComponent } from '../../../../shared/components/challenge-card/challenge-card.component'
import { AuthService } from 'src/app/services/auth.service'
import { SendSolutionModalComponent } from 'src/app/modules/modals/send-solution-modal/send-solution-modal.component'
import { RestrictedModalComponent } from 'src/app/modules/modals/restricted-modal/restricted-modal.component'

describe('ChallengeInfoComponent', () => {
  let component: ChallengeInfoComponent
  let fixture: ComponentFixture<ChallengeInfoComponent>
  // let challengeService: ChallengeService
  let modalService: NgbModal

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
        // ChallengeService,
        AuthService
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeInfoComponent)
    component = fixture.componentInstance
    // challengeService = TestBed.inject(ChallengeService)
    modalService = TestBed.inject(NgbModal)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    it('should call loadRelatedChallenge with the provided related_id', () => {
      const loadRelatedChallengeSpy = spyOn(component, 'loadRelatedChallenge')
      component.related_id = '123'
      component.ngOnInit()

      expect(loadRelatedChallengeSpy).toHaveBeenCalledTimes(1)
      expect(loadRelatedChallengeSpy).toHaveBeenCalledWith('123')
    })
  })

  describe('ngAfterContentChecked', () => {
    beforeEach(() => {
      // Configurar valores fijos en localStorage
      localStorage.setItem('authToken', 'mock-token')
      localStorage.setItem('refreshToken', 'mock-token')
    })

    afterEach(() => {
      // Limpiar localStorage después de las pruebas
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
    })

    it('should set isLogged to true when tokens are present', () => {
      component.ngAfterContentChecked()
      expect(component.isLogged).toBeTruthy()
    })

    it('should set isLogged to false when tokens are not present', () => {
      // Limpiar tokens para esta prueba
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      component.ngAfterContentChecked()
      expect(component.isLogged).toBeFalsy()
    })

    it('should open send solution modal', () => {
      spyOn(modalService, 'open').and.stub()
      component.openSendSolutionModal()

      expect(modalService.open).toHaveBeenCalledWith(SendSolutionModalComponent, { centered: true, size: 'lg' })
    })

    it('should open restricted modal if user is not logged in', () => {
      spyOn(modalService, 'open').and.stub()
      component.isLogged = false // Cambiado a false para simular que el usuario no está autenticado
      component.clickSendButton()

      expect(modalService.open).toHaveBeenCalledWith(RestrictedModalComponent, { centered: true, size: 'lg' })
    })

    it('should onActiveIdchange correctly', () => {
      const newActiveId = 2
      const activeId = 1

      component.onActiveIdChange(newActiveId)

      expect(component.activeIdChange).toBeTruthy()
      component.activeIdChange.emit(activeId)
      expect(component.activeId).toBe(newActiveId)
    })
  })
})
