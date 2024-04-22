import { type AfterContentChecked, Component, Input, ViewChild, inject, OnInit } from '@angular/core'
import { type ChallengeDetails } from 'src/app/models/challenge-details.model'
import { type Example } from 'src/app/models/challenge-example.model'
import { type Language } from 'src/app/models/language.model'
import { ChallengeService } from '../../../../services/challenge.service'
import { type Subscription } from 'rxjs'
import { type DataChallenge } from '../../../../models/data-challenge.model'
import { Challenge } from '../../../../models/challenge.model'
import { type NgbNav } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/services/auth.service'
import { SolutionService } from 'src/app/services/solution.service'

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

  solutionsDummy = [{ solutionName: 'dummy1' }, { solutionName: 'dummy2' }]

  showStatement = true
  isLogged: boolean = false
  activeId = 1
  solutionSent: boolean = false

  idChallenge!: string | any
  params$!: Subscription
  jsonData: Challenge[] = []
  challenge!: Challenge
  dataChallenge!: DataChallenge
  challenges: Challenge[] = []
  challengeSubs$!: Subscription

  related_title: string = ''
  related_creation_date!: Date
  related_level = ''
  related_popularity!: number
  related_languages: Language[] = []
  related_id: string = this.related

  async ngOnInit (): Promise<void> {
    this.solutionService.solutionSent$.subscribe((value) => {
      this.isUserSolution = !value
    })
    this.isLogged = await this.authService.isUserLoggedIn();
   
    this.loadRelatedChallenge(this.related_id)
    
  }

  loadRelatedChallenge (id: string): void {
    this.challengeSubs$ = this.challengeService
      .getChallengeById(id)
      .subscribe((challenge) => {
        this.challenge = new Challenge(challenge)
        this.related_title = this.challenge.challenge_title
        this.related_creation_date = this.challenge?.creation_date
        this.related_level = this.challenge?.level
        this.related_popularity = this.challenge.popularity
        this.related_languages = this.challenge.languages
        this.related_id = this.related
      })
  }
}
