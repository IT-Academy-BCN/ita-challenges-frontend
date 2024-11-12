import {
  type AfterContentChecked,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject
} from '@angular/core'
import { type ChallengeDetails } from 'src/app/models/challenge-details.model'
import { type Example } from 'src/app/models/challenge-example.model'
import { type Language } from 'src/app/models/language.model'
import { ChallengeService } from '../../../../services/challenge.service'
import { type Subscription } from 'rxjs'
import { DataChallenge } from '../../../../models/data-challenge.model'
import { type Challenge } from '../../../../models/challenge.model'
import { NgbModal, type NgbNav } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/services/auth.service'
import { SolutionService } from 'src/app/services/solution.service'
import { SendSolutionModalComponent } from 'src/app/modules/modals/send-solution-modal/send-solution-modal.component'
import { RestrictedModalComponent } from 'src/app/modules/modals/restricted-modal/restricted-modal.component'
import { RelatedService } from '../../../../services/related.service'
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss'],
  providers: [ChallengeService]
})
export class ChallengeInfoComponent implements AfterContentChecked {
  isUserSolution: boolean = true
  challengeSolutions: any[] = []
  private readonly challengeService = inject(ChallengeService)
  private readonly authService = inject(AuthService)
  private readonly solutionService = inject(SolutionService)
  private readonly modalService = inject(NgbModal)
  private readonly relatedService = inject(RelatedService)
  private readonly userService = inject(UserService)

  @ViewChild('nav') nav!: NgbNav

  @Input() detail!: ChallengeDetails
  @Input() solutions: any = []
  @Input() description!: string
  @Input() examples: Example[] = []
  @Input() notes!: string
  @Input() popularity!: number
  @Input() languages: Language[] = []
  @Input() activeId: number = 1
  @Input() idChallenge: string = ''

  @Output() activeIdChange: EventEmitter<number> = new EventEmitter<number>()

  solutionsDummy = [{ solutionName: 'dummy1' }, { solutionName: 'dummy2' }]

  showStatement = true
  isLogged: boolean = false
  solutionSent: boolean = false
  resources: string = '' // TODO resources
  params$!: Subscription
  relatedChallengesData!: DataChallenge
  relatedListOfChallenges: Challenge[] = []
  challengeSubs$!: Subscription
  isDropdownOpen: boolean = false

  async ngOnInit (): Promise<void> {
    this.solutionService.solutionSent$.subscribe((value) => {
      this.isUserSolution = !value
    })

    this.isLogged = this.userService.isUserLoggedIn()

    this.loadRelatedChallenges(this.idChallenge)
    this.solutionService.solutionSent$.subscribe((value) => {
      this.solutionSent = value
    })
  }

  ngAfterContentChecked (): void {
    const token = localStorage.getItem('authToken') // TODO
    const refreshToken = localStorage.getItem('refreshToken') // TODO

    if (
      token !== null &&
      refreshToken !== null &&
      token !== '' &&
      refreshToken !== ''
    ) {
      this.isLogged = true
    }
  }

  loadRelatedChallenges (id: string): void {
    this.challengeSubs$ = this.relatedService
      .getRelatedChallenges(id)
      .subscribe((data) => {
        this.relatedChallengesData = new DataChallenge(data)
        this.relatedListOfChallenges = this.relatedChallengesData.challenges
      })
  }

  onActiveIdChange (newActiveId: number): void {
    if (this.activeIdChange !== null) {
      this.activeId = newActiveId
      this.activeIdChange.emit(this.activeId)
    }
  }

  openSendSolutionModal (): void {
    this.modalService.open(SendSolutionModalComponent, {
      centered: true,
      size: 'lg'
    })
  }

  clickSendButton (): void {
    if (!this.isLogged) {
      this.modalService.open(RestrictedModalComponent, {
        centered: true,
        size: 'lg'
      })
    } else {
      this.solutionService.sendSolution('') // Puedes pasar la solución como argumento si es necesario
    }
  }

  toggleDropdown (): void {
    this.isDropdownOpen = !this.isDropdownOpen
    if (this.isDropdownOpen) {
      document.addEventListener('click', this.handleOutsideClick)
    } else {
      document.removeEventListener('click', this.handleOutsideClick)
    }
  }

  handleOutsideClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement
    const dropdownElement: Element | null = document.querySelector('.dropdown-menu-mobile')
    // Verificación explícita de null usando `!== null`
    if (dropdownElement !== null && !dropdownElement.contains(target)) {
      this.closeDropdown()
    }
  }

  closeDropdown (): void {
    this.isDropdownOpen = false
    document.removeEventListener('click', this.handleOutsideClick)
  }

  selectTab (id: number): void {
    this.activeId = id
    this.isDropdownOpen = false // Cierra el menú desplegable si es necesario
  }

  getTranslatedTabLabel (): string {
    switch (this.activeId) {
      case 1:
        return 'modules.challenge.info.detailsTitle'
      case 2:
        return 'modules.challenge.info.solutionsTitle'
      case 3:
        return 'modules.challenge.info.resourcesTitle'
      case 4:
        return 'modules.challenge.info.relatedTitle'
      default:
        return 'modules.challenge.info.detailsTitle'
    }
  }
}
