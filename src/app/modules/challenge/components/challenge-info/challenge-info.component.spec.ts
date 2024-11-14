import { type ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
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
import { DynamicTranslatePipe } from 'src/app/pipes/dynamic-translate.pipe'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('ChallengeInfoComponent', () => {
  let component: ChallengeInfoComponent
  let fixture: ComponentFixture<ChallengeInfoComponent>
  let modalService: NgbModal

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ChallengeInfoComponent,
        ResourceCardComponent,
        ChallengeCardComponent,
        SolutionComponent,
        RestrictedModalComponent
      ],
      imports: [
        RouterTestingModule,
        I18nModule,
        FormsModule,
        NgbNavModule,
        DynamicTranslatePipe
      ],
      providers: [
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeInfoComponent)
    component = fixture.componentInstance
    modalService = TestBed.inject(NgbModal)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    it('should call loadRelatedChallenges with the provided idChallenge', async () => { // Añadido async aquí
      const loadRelatedChallengesSpy = jest.spyOn(component, 'loadRelatedChallenges')
      component.idChallenge = '123'
      await component.ngOnInit() // Ahora el await se permite dentro de la función marcada como async

      expect(loadRelatedChallengesSpy).toHaveBeenCalledTimes(1)
      expect(loadRelatedChallengesSpy).toHaveBeenCalledWith('123')
    })
  })

  it('should open send solution modal', () => {
    jest.spyOn(modalService, 'open').mockImplementation()
    component.openSendSolutionModal()
    expect(modalService.open).toHaveBeenCalledWith(SendSolutionModalComponent, { centered: true, size: 'lg' })
  })

  it('should open restricted modal if user is not logged in', () => {
    jest.spyOn(modalService, 'open').mockImplementation()
    component.isLogged = false
    component.clickSendButton()
    expect(modalService.open).toHaveBeenCalledWith(RestrictedModalComponent, { centered: true, size: 'lg' })
  })

  it('should onActiveIdChange correctly', fakeAsync(() => {
    const newActiveId = 2

    component.onActiveIdChange(newActiveId)

    tick()
    expect(component.activeIdChange).toBeTruthy()
    expect(component.activeId).toBe(newActiveId)
  }))

  // it('should onActiveIdchange correctly', () => {
  //   const newActiveId = 2
  //   const activeId = 1

  //   component.onActiveIdChange(newActiveId)

  //   expect(component.activeIdChange).toBeTruthy()
  //   component.activeIdChange.emit(activeId)
  //   expect(component.activeId).toBe(newActiveId)
  // })
})
