import { type Solution } from './solution.model'

export class DataSolution {
  count: number
  offset: number
  limit: number
  results: Solution[] = []

  constructor (element: any) {
    this.count = element.count
    this.offset = element.offset
    this.limit = element.limit
    element.results.forEach((solution: Solution) => {
      this.results.push(solution)
    })
  }
}
