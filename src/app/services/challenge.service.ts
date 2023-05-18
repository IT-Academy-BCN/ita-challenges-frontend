import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class ChallengeService {

    constructor(private http: HttpClient) { }

    getChallenge():Observable<Object>{
        /*        return this.http.get(`${environment.BACKEND_BASE_URL}${environment.BACKEND_ALL_CHALLENGES}`,
                    {
                        headers: {
                            'Content-Type': 'application/dummy'
                        }
                    });*/
        return this.http.get('../assets/dummy/data-challenge.json',
            {
                headers: {
                    'Content-Type': 'application/dummy'
                }
            });
    }

}
