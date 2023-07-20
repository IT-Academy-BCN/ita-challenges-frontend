export class FilterChallenge{
    //probablement es pot afinar, per exemple levels: low, medium, high
    languages : number[];
    levels : string[];
    progress: number[];

    constructor(element: any) {
        this.languages = element.id_language;
        this.levels = element.id_levels;
        this.progress = element.id_progress;
    }



}