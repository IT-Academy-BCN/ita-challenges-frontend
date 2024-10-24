export interface UserSolution {
  offset: number
  limit: number
  count: number
  results: Result[]
}

export interface Result {
  id_challenge: string
  language: string
  id_user: string
  solutions: SolutionsUser[]
}

export interface SolutionsUser {
  uuid: string
  solutionText: string
}
