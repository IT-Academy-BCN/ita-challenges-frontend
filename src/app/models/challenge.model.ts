import {ChallengeDetails} from "./challenge-details.model";
import {Language} from "./language.model";
import {Solution} from "./solution.model";
import {Resource} from "./resource.model";

export class Challenge {
    idChallenge: string;
    challengeTitle: string;
    level: string;
    creationDate: Date;
    challengeDetails: ChallengeDetails;
    languages: Language[] = [];
    solutions: Solution[] = [];
    resources: Resource[] = [];
    challengesRelated: string[] = [];

    constructor(element: any) {
        this.idChallenge = element.id_challenge
        this.challengeTitle = element.challenge_title;
        this.level = element.level;
        this.creationDate = element.creation_date;
        this.challengeDetails = element.details;

        element.languages.forEach( (language: any) => {
            this.languages.push(language);
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