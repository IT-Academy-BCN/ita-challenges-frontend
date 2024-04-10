import { Component } from '@angular/core'
import { type ActivatedRoute, type ParamMap } from '@angular/router'
import { type Subscription } from 'rxjs'
import { Challenge } from '../../../../models/challenge.model'
import { type ChallengeService } from '../../../../services/challenge.service'
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

  title = ''
  creation_date!: Date
  level = ''
  details!: ChallengeDetails
  related: string[] = []
  resources: Resource[] = []
  solutions: Solution[] = []
  description = ''
  examples: Example[] = []
  notes = ''
  popularity!: number
  languages: Language[] = []

  constructor (
    private readonly route: ActivatedRoute,
    private readonly challengeService: ChallengeService
  ) {
    this.params$ = this.route.paramMap.subscribe((params: ParamMap) => {
      this.idChallenge = params.get('idChallenge') ?? ''
    })
  }

  ngOnInit (): void {
    this.loadMasterData(this.idChallenge)
  }

  ngOnDestroy (): void {
    if (this.params$ !== undefined) this.params$.unsubscribe()
    if (this.challengeSubs$ !== undefined) this.challengeSubs$.unsubscribe()
  }

  loadMasterData (id: string): void {
    this.challengeSubs$ = this.challengeService.getChallengeById(id).subscribe((challenge) => {
      this.challenge = new Challenge(challenge)
      this.title = this.challenge.challenge_title
      this.creation_date = this.challenge.creation_date
      this.level = this.challenge.level
      this.details = this.challenge.details
      this.related = this.challenge.related
      this.resources = this.challenge.resources
      this.solutions = this.challenge.solutions
      this.description = this.challenge.details.description
      this.examples = this.challenge.details.examples
      this.notes = this.challenge.details.notes
      this.popularity = this.challenge.popularity
      this.languages = this.challenge.languages
    })
  }
}
