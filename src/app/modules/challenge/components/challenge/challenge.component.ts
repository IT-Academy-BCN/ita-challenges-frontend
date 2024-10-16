import { Component, inject } from '@angular/core'
import { ActivatedRoute, type ParamMap } from '@angular/router'
import { type Subscription } from 'rxjs'
import { Challenge } from '../../../../models/challenge.model'
import { ChallengeService } from '../../../../services/challenge.service'
import { type ChallengeDetails } from 'src/app/models/challenge-details.model'
import { type Solution } from 'src/app/models/solution.model'
import { type Resource } from 'src/app/models/resource.model'
import { type Example } from 'src/app/models/challenge-example.model'
import { type Language } from 'src/app/models/language.model'

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent {
  idChallenge: string = ''
  params$!: Subscription
  challenge!: Challenge
  challengeSubs$!: Subscription
  dataChallenge!: Challenge
  title: string = ''
  creation_date!: Date
  level = ''
  detail!: ChallengeDetails
  related: string[] = []
  resources: Resource[] = []
  solutions: Solution[] = []
  description: string = ''
  examples: Example[] = []
  notes: string = ''
  popularity!: number
  languages: Language[] = []
  activeId: number = 1

  private readonly route = inject(ActivatedRoute)
  private readonly challengeService = inject(ChallengeService)

  ngOnInit (): void {
    this.params$ = this.route.paramMap.subscribe((params: ParamMap) => {
      this.idChallenge = params.get('idChallenge') ?? ''
      this.loadMasterData(this.idChallenge)
      this.activeId = 1
    })
  }

  ngOnDestroy (): void {
    if (this.params$ !== undefined) this.params$.unsubscribe()
    if (this.challengeSubs$ !== undefined) this.challengeSubs$.unsubscribe()
  }

  onActiveIdChange (newActiveId: number): void {
    this.activeId = newActiveId
  }

  loadMasterData (id: string): void {
    this.challengeSubs$ = this.challengeService.getChallengeById(id).subscribe((challenge) => {
      this.challenge = new Challenge(challenge)
      this.title = this.challenge.challenge_title
      this.creation_date = this.challenge.creation_date
      this.level = this.challenge.level
      this.detail = this.challenge.detail
      this.solutions = this.challenge.solutions
      this.description = this.challenge.detail.description
      this.examples = this.challenge.detail.examples
      this.notes = this.challenge.detail.notes
      this.popularity = this.challenge.popularity
      this.languages = this.challenge.languages
    })
  }
}
