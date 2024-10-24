export class SolutionResults {
  id_solution: string
  solution_text: string
  uuid_language: string
  uuid_challenge: string | null

  constructor (element: any) {
    this.id_solution = element.id_solution
    this.solution_text = element.solution_text
    this.uuid_language = element.uuid_language
    this.uuid_challenge = element.uuid_challenge
  }
}
