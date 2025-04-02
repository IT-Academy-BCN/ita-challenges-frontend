/* export interface CreateChallenge {
  challengeTitle: string
  description: string
  level: 'EASY' | 'MEDIUM' | 'HARD'
  language: 'Java' | 'PHP' | 'Python' | 'Javascript' | 'Typescript' | 'SQL'
  solution: string
} */
export interface CreateChallenge {
  challengeTitle: string
  description: string
  level: 'EASY' | 'MEDIUM' | 'HARD'
  language: string
  solution: string
  tags: string[]
}
