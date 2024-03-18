export type Challenges = Challenge[]

export interface Challenge {
    _id: Id
    challenge_title: ChallengeTitle
    level: string
    creation_date: CreationDate
    detail: Detail
    languages: Language[]
    solutions: Solution[]
    resources: Resource[]
    related: Related[]
    testing_values: TestingValue[]
}

export interface Id {
    $uuid: string
}

export interface ChallengeTitle {
    ES: string
    CAT: string
    EN: string
    [key: string]: string; 
}

export interface CreationDate {
    $date: string
}

export interface Detail {
    description: Description
    examples: Example[]
    notes: Notes
}

export interface Description {
    ES: string
    CAT: string
    EN: string
    [key: string]: string; 
}

export interface Example {
    _id: Id2
    example_text: ExampleText
}

export interface Id2 {
    $uuid: string
}

export interface ExampleText {
    ES: string
    CAT: string
    EN: string
    [key: string]: string; 
}

export interface Notes {
    ES: string
    CAT: string
    EN: string
    [key: string]: string; 
}

export interface Language {
    _id: Id3
    language_name: string
}

export interface Id3 {
    $uuid: string
}

export interface Solution {
    $uuid: string
}

export interface Resource {
    $uuid: string
}

export interface Related {
    $uuid: string
}

export interface TestingValue {
    in_param: any
    out_param: any
    "in param": any
}
