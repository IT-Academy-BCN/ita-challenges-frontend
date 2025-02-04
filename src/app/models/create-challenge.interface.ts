export interface CreateChallenge {
  challengeTitle: string
  description: string
  level: 'EASY' | 'MEDIUM' | 'HARD'
  language: 'Java' | 'PHP' | 'Python' | 'JavaScript'
  solution: string
}
