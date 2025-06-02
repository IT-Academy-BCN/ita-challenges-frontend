import { type ChallengeDetails } from './challenge-details.model'
import { type Language } from './language.model'
import { type Solution } from './solution.interface'

export class Challenge {
  id_challenge: string
  challenge_title: string
  level: string
  creation_date: Date
  popularity: number
  favorites_count: number
  saved_count: number
  timesFavorite: number
  detail: ChallengeDetails
  languages: Language[] = []
  solutions: Solution[] = []
  timesSolved: number

  constructor (element: any) {
    this.id_challenge = element.id_challenge
    this.challenge_title = element.challenge_title
    this.level = element.level
    this.creation_date = element.creation_date
    this.popularity = element.popularity
    this.favorites_count = element.favorites_count || 0
    this.saved_count = element.saved_count || 0
    this.timesFavorite = element.timesFavorite || 0
    this.timesSolved = element.timesSolved || 0
    this.detail = element.detail

    element.languages.forEach((language: Language) => {
      this.languages.push(language)
    })

    element.solutions.forEach((solution: Solution) => {
      this.solutions.push(solution)
    })
  }
}

export class ChallengeResponse {
  count: number
  limit: number
  offset: number
  results: Challenge[]

  constructor (data: any) {
    this.count = data.count
    this.limit = data.limit
    this.offset = data.offset
    this.results = data.results.map((item: any) => new Challenge(item))
  }
}
