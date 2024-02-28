export class Language {

    id_language: string;
    language_name: string;

    constructor(element: any) {
        this.id_language = element.id_language;
        this.language_name = element.language_name;
    }
}