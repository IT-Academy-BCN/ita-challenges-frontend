export interface UserSolution {
  uuid_user: string
  uuid_challenge: string
  uuid_language: string
  solution_text: string
  status: 'IN_PROGRESS' | 'ENDED'
}

export interface SubmitSolutionResponse {
  solution_text: string
  isSolved?: boolean
  timesSolved?: number
}
