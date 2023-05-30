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
    challenge_details: ChallengeDetails;
    languages: Language[] = [];
    solutions: Solution[] = [];
    resources: Resource[] = [];
    challengesRelated: string[] = [];

    constructor(element: any) {
        this.id_challenge = element.id_challenge;
        this.challenge_title = element.challenge_title;
        this.level = element.level;
        this.creation_date = element.creation_date;
        this.popularity = element.popularity;
        this.challenge_details = element.details;

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

        element.challengesRelated.forEach( (challengeRelated: any) => {
            this.challengesRelated.push(challengeRelated);
        });
    }


}