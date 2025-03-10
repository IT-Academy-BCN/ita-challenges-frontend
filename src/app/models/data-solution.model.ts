import { type SolutionResults } from './solution-results.model'

export class DataSolution {
  count: number
  offset: number
  limit: number
  results: SolutionResults[] = []

  constructor (element: any) {
    this.count = element.count
    this.offset = element.offset
    this.limit = element.limit
    element.results.forEach((solution: SolutionResults) => {
      this.results.push(solution)
    })
  }
}
