import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { I18nModule } from '../../../../../assets/i18n/i18n.module'
import { ChallengeHeaderComponent } from './challenge-header.component'
import { SolutionService } from '../../../../services/solution.service'
import { RouterTestingModule } from '@angular/router/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SendSolutionModalComponent } from '../../../modals/send-solution-modal/send-solution-modal.component'
import { RestrictedModalComponent } from '../../../modals/restricted-modal/restricted-modal.component'
import { AuthService } from 'src/app/services/auth.service'
import { DynamicTranslatePipe } from 'src/app/pipes/dynamic-translate.pipe'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('ChallengeHeaderComponent', () => {
  let component: ChallengeHeaderComponent
  let fixture: ComponentFixture<ChallengeHeaderComponent>
  let modalService: NgbModal

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ChallengeHeaderComponent
      ],
      imports: [I18nModule,
        RouterTestingModule,
        DynamicTranslatePipe],
      providers: [
        NgbModal,
        SolutionService,
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ChallengeHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    modalService = TestBed.inject(NgbModal)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize input correctly', () => {
    component.title = 'Test Title'
    component.creation_date = new Date()
    component.level = 'Easy'
    component.activeId = 1

    expect(component.title).toEqual('Test Title')
    expect(component.creation_date).toBeDefined()
    expect(component.level).toEqual('Easy')
    expect(component.activeId).toEqual(1)
  })

  it('should open send solution modal', () => {
    spyOn(modalService, 'open').and.stub()
    component.openSendSolutionModal()

    expect(modalService.open).toHaveBeenCalledWith(SendSolutionModalComponent, { centered: true, size: 'lg' })
  })

  it('should open restricted modal if user is not logged in', () => {
    if (modalService !== null && modalService !== undefined) { // Asegúrate de que modalService existe antes de espiarlo
      spyOn(modalService, 'open').and.stub()
      component.isLogged = false // Cambiado a false para simular que el usuario no está autenticado
      component.clickSendButton()
    }
    expect(modalService.open).toHaveBeenCalledWith(RestrictedModalComponent, { centered: true, size: 'lg' })
  })
})
