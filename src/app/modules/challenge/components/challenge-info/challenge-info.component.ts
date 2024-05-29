import {
  type AfterContentChecked,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
  SimpleChanges,
  OnChanges
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
import { Solution } from 'src/app/models/solution.model'
import { DataSolution } from 'src/app/models/data-solution.model'

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss'],
  providers: [ChallengeService]
})
export class ChallengeInfoComponent implements AfterContentChecked, OnChanges {
  isUserSolution: boolean = true
  showStatement = true
  isLogged: boolean = false
  solutionSent: boolean = false
  resources: string = ''
  params$!: Subscription
  relatedChallengesData!: DataChallenge
  relatedListOfChallenges: Challenge[] = []
  challengeSubs$!: Subscription
  challengeSolutions: Solution[] = []

  private readonly authService = inject(AuthService)
  private readonly solutionService = inject(SolutionService)
  private readonly modalService = inject(NgbModal)
  private readonly relatedService = inject(RelatedService)

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['languages'] && changes['languages'].currentValue.length > 0) {
      this.loadSolutions(this.idChallenge, this.languages[0].id_language)

    }
  }

  async ngOnInit (): Promise<void> {

    this.solutionService.solutionSent$.subscribe((value) => {
      this.isUserSolution = !value
      this.solutionSent = value
    })
    this.isLogged = this.authService.isUserLoggedIn()
    this.loadRelatedChallenges(this.idChallenge)
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

    this.solutionService.activeId$.subscribe((value) => {
      this.activeId = value
    })
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
    const modalRef = this.modalService.open(SendSolutionModalComponent, {
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

  loadSolutions(idChallenge: string, idLanguage: string): void {
    this.solutionService.getAllSolutions(idChallenge, idLanguage).subscribe((data) => {
      this.challengeSolutions = data.results
      console.log('0 challenge-info.component, solutions:', this.challengeSolutions)
    })
  }
}
