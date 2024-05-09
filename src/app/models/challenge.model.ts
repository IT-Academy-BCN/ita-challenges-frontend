import { type ChallengeDetails } from './challenge-details.model'
import { type Language } from './language.model'
import { type Solution } from './solution.model'

export class Challenge {
  id_challenge: string
  challenge_title: string
  level: string
  creation_date: Date
  popularity: number
  details: ChallengeDetails
  languages: Language[] = []
  solutions: Solution[] = []

  constructor (element: any) {
    this.id_challenge = element.id_challenge
    this.challenge_title = element.challenge_title
    this.level = element.level
    this.creation_date = element.creation_date
    this.popularity = element.popularity
    this.details = element.details

    element.languages.forEach((language: Language) => {
      this.languages.push(language)
    })

    element.solutions.forEach((solution: Solution) => {
      this.solutions.push(solution)
    })

  }
}
