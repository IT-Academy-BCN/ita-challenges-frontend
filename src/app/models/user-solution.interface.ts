export interface userSolution {
  offset: number
  limit: number
  count: number
  results: Result[]
}

export interface Result {
  id_challenge: string
  language: string
  id_user: string
  solutions: UserSolution[]
}

export interface UserSolution {
  uuid: string
  solution_text: string
}
