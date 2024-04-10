import { type ChallengeDetails } from './challenge-details.model'
import { type Language } from './language.model'
import { type AdditionalPropChallenge } from './challenge-add-prop.model'

export class Challenge {
  id_challenge: string
  challenge_title: AdditionalPropChallenge[] = []
  level: string
  creation_date: Date
  detail: ChallengeDetails
  popularity: number
  languages: Language[] = []
  solutions: string[] = []

  constructor (element: any) {
    this.id_challenge = element.id_challenge
    this.challenge_title = element.challenge_title
    this.level = element.level
    this.creation_date = element.creation_date
    this.popularity = element.popularity
    this.detail = element.details

    element.challenge_title.forEach((title: AdditionalPropChallenge) => {
      this.challenge_title.push(title)
    })

    element.languages.forEach((language: Language) => {
      this.languages.push(language)
    })

    element.solutions.forEach((solution: string) => {
      this.solutions.push(solution)
    })
  }
}
