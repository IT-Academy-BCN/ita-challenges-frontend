import { SolutionStatus } from "./user-solution-status.enum"

export interface UserSolution {
  uuid_user: string
  uuid_challenge: string
  uuid_language: string
  solution_text: string
  status: SolutionStatus
}

export interface SubmitSolutionResponse {
  solution_text: string
  isSolved?: boolean
  timesSolved?: number
}
