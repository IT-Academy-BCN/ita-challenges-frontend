import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
	providedIn: "root",
})
export class ResourceService {
	constructor(private http: HttpClient) {}

	// hay que ponerlos en los environments
	topicId: string = "/clpjkx4540009jz0ips2i30ca";
	private baseUrl: string =
		"https://dev.api.itadirectory.eurecatacademy.org/api/v1/resources/topic";

	getResource(topicID: string): Observable<any> {
		return this.http.get(`${this.baseUrl}${this.topicId}`).pipe(
			map((response: any) => {
				console.log(response);
				return {
					resources: response.resources.map((res: any) => ({
						id: res.id,
						title: res.title,
						description: res.description,
						user: res.user,
					})),
					topic: {
						name: response.topics.topic.name,
						id: response.topics.topic.id,
					},
				};
			})
		);
	}
}
