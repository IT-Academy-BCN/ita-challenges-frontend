export type Challenges = Challenge[]

export interface Challenge {
    id_challenge: string,
    challenge_title: ChallengeTitle
    level: string,
    creation_date: Date,
    detail: Detail
    languages: Language[]
    solutions: string
}

export interface ChallengeTitle {
    [key: string]: string; 
}

export interface Detail {
    description: Description
    examples: Example[]
    note: Note | null
}

export interface Description {
    [key: string]: string; 
}

export interface Example {
    idExample: string,
    exampleText: ExampleText
}

export interface ExampleText {
    [key: string]: string; 
}

export interface Note {
    [key: string]: string; 
    
}

export interface Language {
    id_language: string
    language_name: string
}
