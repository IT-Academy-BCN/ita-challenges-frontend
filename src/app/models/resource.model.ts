export class Resource {

    id_resource: string;
    resource_description: string;
    author: string;
    generation_date: Date;

    constructor(element: any) {
        this.id_resource = element.id_resource;
        this.resource_description = element.resource_description;
        this.author = element.author;
        this.generation_date = element.generation_date;
    }

}
