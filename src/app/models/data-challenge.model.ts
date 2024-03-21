import { type Challenge } from './challenge.model'

export class DataChallenge {
  count: number
  offset: number
  limit: number
  challenges: Challenge[] = []

  constructor (element: any) {
    this.count = element.count
    this.offset = element.offset
    this.limit = element.limit
    element.results.forEach((challenge: any) => {
      this.challenges.push(challenge)
    })
  }
}
