import { type Example } from './challenge-example.model'

export class ChallengeDetails {
  description: string
  examples: Example[] = []
  notes: string

  constructor (element: { description: string, notes: string, examples: any[] }) {
    this.description = element.description
    this.notes = element.notes

    element.examples.forEach((example: Example) => {
      this.examples.push(example)
    })
  }
}
