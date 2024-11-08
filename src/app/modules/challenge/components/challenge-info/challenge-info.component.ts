import {
  ChangeDetectorRef,
  // type AfterContentChecked,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
  type OnInit
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
import { type SolutionResults } from 'src/app/models/solution-results.model'
import { UserService } from 'src/app/services/user.service'
@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss'],
  providers: [ChallengeService]
})
export class ChallengeInfoComponent
implements OnInit {
  showStatement = true
  isLogged: boolean = false
  solutionSent: boolean = false
  isUserSolution: boolean = true
  resources: string = ''
  params$!: Subscription
  relatedChallengesData!: DataChallenge
  relatedListOfChallenges: Challenge[] = []
  challengeSubs$!: Subscription
  challengeSolutions: SolutionResults[] = []
  // idLanguage: string = ''
  idLanguageJava = '660e1b18-0c0a-4262-a28a-85de9df6ac5f'
  userId!: string

  private readonly authService = inject(AuthService)
  private readonly solutionService = inject(SolutionService)
  private readonly modalService = inject(NgbModal)
  private readonly relatedService = inject(RelatedService)
  private readonly userService = inject(UserService)
  private readonly cd = inject(ChangeDetectorRef)

  @ViewChild('nav') nav!: NgbNav

  @Input() detail!: ChallengeDetails
  @Input() description!: string
  @Input() examples: Example[] = []
  @Input() notes!: string
  @Input() popularity!: number
  @Input() languages: Language[] = []
  @Input() activeId: number = 1
  @Input() idChallenge: string = ''

  @Output() activeIdChange: EventEmitter<number> = new EventEmitter<number>()

  solutionsDummy = [{ solutionName: 'dummy1' }, { solutionName: 'dummy2' }]

  async ngOnInit (): Promise<void> {
    console.log('ngOnInit - inizializzazione del componente')

    this.solutionService.activeIdSubject.next(1)

    this.solutionService.solutionSent$.subscribe((value) => {
      this.isUserSolution = !value
      this.solutionSent = value
    })

    this.solutionService.activeId$.subscribe((newActiveId) => {
      this.onActiveIdChange(newActiveId)
    })

    this.isLogged = this.userService.isUserLoggedIn()

    this.loadRelatedChallenges(this.idChallenge)

    this.loadSolutions(this.idChallenge, this.idLanguageJava)
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
    console.log('onActiveIdChange - Cambio de activeId a:', newActiveId)
    if (this.activeIdChange !== null) {
      Promise.resolve().then(() => {
        this.activeId = newActiveId
        this.activeIdChange.emit(this.activeId)
      }).catch((error) => {
        console.error('Error in onActiveIdChange:', error)
      })
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
      this.solutionService.sendSolution('')
      // this.loadSolutions(this.idChallenge, this.idLanguageJava)
      this.onActiveIdChange(2)
    }
  }

  loadSolutions (idChallenge: string, idLanguage: string): void {
    this.solutionService
      .getAllChallengeSolutions(idChallenge, idLanguage)
      .subscribe((data) => {
        console.log('Raw data from API:', data)
        if (data.results.length > 0) {
          this.challengeSolutions = data.results
          console.log('Challenge Solutions Loaded:', this.challengeSolutions)
        } else {
          console.log('No solutions found or data format issue')
        }
      })
  }
}
