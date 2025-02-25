export interface CreateChallenge {
  challengeTitle: string
  description: string
  level: 'EASY' | 'MEDIUM' | 'HARD'
  language: string
  solution: string
}
