import { Component, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { type Subscription } from 'rxjs'
import { Challenge } from '../../../../models/challenge.model'
import { ChallengeService } from '../../../../services/challenge.service'
import { ChallengeDetails } from 'src/app/models/challenge-details.model'
import { type SolutionResults } from 'src/app/models/solution-results.model'
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
  solutions: SolutionResults[] = []
  description: string = ''
  examples: Example[] = []
  notes: string = ''
  popularity!: number
  languages: Language[] = []
  activeId: number = 1
  startChallenge: boolean = false

  private readonly route = inject(ActivatedRoute)
  private readonly challengeService = inject(ChallengeService)

  ngOnInit (): void {
    const id = this.route.snapshot.paramMap.get('idChallenge')
    // Usar ?? para asignar valor por defecto solo si id es null o undefined
    this.idChallenge = id ?? ''

    if (this.idChallenge !== '') {
      this.loadMasterData(this.idChallenge)
    }
    this.activeId = 1
  }

  onStartChallenge (started: boolean): void {
    this.startChallenge = started
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
      console.log(challenge)
      this.challenge = new Challenge(challenge)
      this.title = this.challenge.challenge_title
      this.creation_date = this.challenge.creation_date
      this.level = this.challenge.level

      // Verificación explícita para evitar que el valor sea nulo o vacío
      if (this.challenge.detail !== null && this.challenge.detail !== undefined && Object.keys(this.challenge.detail).length > 0) {
        this.detail = new ChallengeDetails(this.challenge.detail)
        this.description = this.detail.description
        this.examples = this.detail.examples
        this.notes = this.detail.notes
      }

      this.popularity = this.challenge.popularity
      this.languages = this.challenge.languages
    })
  }
}
