export class Language {

    idLanguage: number;
    languageName: string;

    constructor(element: any) {
        this.idLanguage = element.id_language;
        this.languageName = element.language_name;
    }
}