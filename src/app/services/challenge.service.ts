import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class ChallengeService {

    
    constructor(private http: HttpClient) {}
  
    getChallengeById(id: string):Observable<Object>{

        console.log(id)
        const url = `${environment.BACKEND_ITA_CHALLENGE_BASE_URL}${environment.BACKEND_ALL_CHALLENGES}/${id}`
        console.log(url)
        
        return this.http.get(url, 
                    {
                        headers: {
                            'Content-Type': 'application/json' 
                        }
                    });
    }
}