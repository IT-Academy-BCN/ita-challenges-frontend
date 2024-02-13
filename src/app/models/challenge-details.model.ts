import { Example } from "./challenge-example.model";

export class ChallengeDetails{
    description: string;
    examples: Example[] = [];
    notes: string;

    constructor(element: any) {
        this.description = element.description;
        this.notes = element.notes;


    element.examples.forEach( (example: any) => {
        this.examples.push(example);
    });



}

}