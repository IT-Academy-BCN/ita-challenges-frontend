import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class StarterService {

    constructor(private http: HttpClient) { }

    getAllChallenges(page: number, pageSize: number): Observable<Object> {

        const params = {
            page: page.toString(),
            pageSize: pageSize.toString()
        };

        console.log(params)

        return this.http.get(`${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES}`,
            {
                params,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

    }

}