import { SolutionStatus } from './user-solution-status.enum'

export class FilterChallenge {
  languages: string[] = []
  levels: string[] = []
  progress: SolutionStatus[] = []
  tags?: string[] = []
}
