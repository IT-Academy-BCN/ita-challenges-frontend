import { type AdditionalPropChallenge } from './challenge-add-prop.model'

export class Example {
  idExample: string
  exampleText: AdditionalPropChallenge[] = []

  constructor (element: any) {
    this.idExample = element.id_example

    element.exampleText.forEach((example: AdditionalPropChallenge) => {
      this.exampleText.push(example)
    })
  }
}
