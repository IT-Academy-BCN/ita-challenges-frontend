import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
//import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class StarterService {

    constructor(private http: HttpClient) { }

    getAllChallenges(page: number, pageSize: number):Observable<Object>{
        /*        return this.http.get(`${environment.BACKEND_BASE_URL}${environment.BACKEND_ALL_CHALLENGES}`,
                    {
                        headers: {
                            'Content-Type': 'application/dummy'
                        }
                    });*/


        const params = {
            page: page.toString(),
            pageSize: pageSize.toString()
        }
        return this.http.get('../assets/dummy/data-challenge.json',
            {
                params,
                headers: {
                    'Content-Type': 'application/dummy'
                }
            });
    }

}