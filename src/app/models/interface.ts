export interface Challenge {
  id_challenge: string
  challenge_title: ChallengeTitle
  level: Level
  creation_date: Date
  detail: Detail
  languages: Language[]
  solutions: string[]
}

export interface ChallengeTitle {
  es: string
  en: string
  ca: string
}

export interface Detail {
  description: ChallengeTitle
  examples: Example[]
  notes: ChallengeTitle
}

export interface Example {
  id_example: string
  example_text: ChallengeTitle | null
}

export interface Language {
  id_language: string
  language_name: LanguageName
}

export enum LanguageName {
  Java = 'Java',
  Javascript = 'Javascript',
  PHP = 'PHP',
  Python = 'Python',
}

export enum Level {
  Easy = 'EASY',
  Hard = 'HARD',
  Medium = 'MEDIUM',
}
