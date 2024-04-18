export type Challenges = Challenge[]

export interface Challenge {
  id_challenge: string
  challenge_title: ChallengeTitle
  level: string
  creation_date: Date
  detail: Detail
  languages: Language[]
  solutions: string
}

export type ChallengeTitle = Record<string, string>

export interface Detail {
  description: Description
  examples: Example[]
  note: Note | null
}

export type Description = Record<string, string>

export interface Example {
  idExample: string
  exampleText: ExampleText
}

export type ExampleText = Record<string, string>

export type Note = Record<string, string>

export interface Language {
  id_language: string
  language_name: string
}
