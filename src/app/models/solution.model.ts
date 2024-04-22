export class Solution {
  idSolution: string
  solutionText: string

  constructor (element: any) {
    this.idSolution = element.id_solution
    this.solutionText = element.solution_text
  }
}
