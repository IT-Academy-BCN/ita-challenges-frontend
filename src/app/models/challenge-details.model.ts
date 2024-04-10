import { type Example } from './challenge-example.model'
import { type AdditionalPropChallenge } from './challenge-add-prop.model'

export class ChallengeDetails {
  description: AdditionalPropChallenge[] = []
  examples: Example[] = []
  note: AdditionalPropChallenge[] = []

  constructor (element: { description: AdditionalPropChallenge[], note: AdditionalPropChallenge[], examples: any[] }) {
    element.description.forEach((description: AdditionalPropChallenge) => {
      this.description.push(description)
    })
    element.examples.forEach((example: Example) => {
      this.examples.push(example)
    })
    element.note.forEach((note: AdditionalPropChallenge) => {
      this.note.push(note)
    })
  }
}
