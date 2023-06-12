import {ChallengeDetails} from "./challenge-details.model";
import {Language} from "./language.model";
import {Solution} from "./solution.model";
import {Resource} from "./resource.model";

export class Challenge {
    id_challenge: string;
    challenge_title: string;
    level: string;
    creation_date: Date;
    popularity: number;
    details: ChallengeDetails;
    languages: Language[] = [];
    solutions: Solution[] = [];
    resources: Resource[] = [];
    related: string[] = [];

    constructor(element: any) {
        this.id_challenge = element.id_challenge;
        this.challenge_title = element.challenge_title;
        this.level = element.level;
        this.creation_date = element.creation_date;
        this.popularity = element.popularity;
        this.details = element.details;

        element.languages.forEach( (language: any) => {
            this.languages.push(language);
            console.log("languages" + this.languages);
        });

        element.solutions.forEach( (solution: any) => {
            this.solutions.push(solution);
        });

        element.resources.forEach( (resource: any) => {
            this.resources.push(resource);
        });

        element.related.forEach( (challengeRelated: any) => {
            this.related.push(challengeRelated);
        });
    }


}