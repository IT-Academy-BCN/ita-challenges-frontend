import { Component, Input, ViewChild, inject, Output, EventEmitter, type OnInit } from '@angular/core'
import { type ChallengeDetails } from 'src/app/models/challenge-details.model'
import { type Example } from 'src/app/models/challenge-example.model'
import { type Language } from 'src/app/models/language.model'
import { ChallengeService } from '../../../../services/challenge.service'
import { type Subscription } from 'rxjs'
import { type DataChallenge } from '../../../../models/data-challenge.model'
import { Challenge } from '../../../../models/challenge.model'
import { NgbModal, type NgbNav } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/services/auth.service'
import { SolutionService } from 'src/app/services/solution.service'
import { SendSolutionModalComponent } from 'src/app/modules/modals/send-solution-modal/send-solution-modal.component'
import { RestrictedModalComponent } from 'src/app/modules/modals/restricted-modal/restricted-modal.component'

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss'],
  providers: [ChallengeService]
})
export class ChallengeInfoComponent implements OnInit {
  isUserSolution: boolean = true
  private readonly challengeService = inject(ChallengeService)
  private readonly authService = inject(AuthService)
  private readonly solutionService = inject(SolutionService)
  private readonly modalService = inject(NgbModal)

  @ViewChild('nav') nav!: NgbNav

  @Input() related: any = []
  @Input() resources: any = []
  @Input() details!: ChallengeDetails
  @Input() solutions: any = []
  @Input() description!: string
  @Input() examples: Example[] = []
  @Input() notes!: string
  @Input() popularity!: number
  @Input() languages: Language[] = []
  @Input() activeId: number = 1

  @Output() activeIdChange: EventEmitter<number> = new EventEmitter<number>()

  solutionsDummy = [{ solutionName: 'dummy1' }, { solutionName: 'dummy2' }]

  showStatement = true
  isLogged: boolean = false
  // activeId = 1
  solutionSent: boolean = false

  idChallenge!: string | any
  params$!: Subscription
  jsonData: Challenge[] = []
  challenge!: Challenge
  dataChallenge!: DataChallenge
  challenges: Challenge[] = []
  challengeSubs$!: Subscription

  related_title = ''
  related_creation_date!: Date
  related_level = ''
  related_popularity!: number
  related_languages: Language[] = []
  related_id: string = this.related

  async ngOnInit (): Promise<void> {
    this.solutionService.solutionSent$.subscribe((value) => {
      this.isUserSolution = !value
    })
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    this.isLogged = await this.authService.isUserLoggedIn()
    this.loadRelatedChallenge(this.related_id)
  }

  loadRelatedChallenge (id: string): void {
    this.challengeSubs$ = this.challengeService
      .getChallengeById(id)
      .subscribe((challenge) => {
        this.challenge = new Challenge(challenge)
        this.related_title = this.challenge?.challenge_title
        this.related_creation_date = this.challenge?.creation_date
        this.related_level = this.challenge?.level
        this.related_popularity = this.challenge.popularity
        this.related_languages = this.challenge.languages
        this.related_id = this.related
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
}
