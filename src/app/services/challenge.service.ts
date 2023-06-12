import {Injectable} from "@angular/core";
import {Observable, map, tap, catchError, of, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { Challenge } from "../models/challenge.model";
import { StarterService } from "./starter.service";

@Injectable({
    providedIn: 'root'
})

export class ChallengeService {

    
    constructor(private http: HttpClient) {}
  
    getChallenge(id: string, challenges: Challenge[]): Observable<Challenge> {
        console.log(challenges);  
        const challenge: Challenge  = challenges.find(({ id_challenge }) => id_challenge === id)!;
        
       
        console.log(challenge);
        return of (challenge);     
  }
}







    /*getChallenges(): Observable<Challenge[]> {
        const challenges = of(Challenge);
        return challenges;
      }


    getChallenge(id: string): Observable<Challenge> {
            
            const challenge = this.challenges.find((ch: { id: string; }) => ch.id === id)!;
            console.log(challenge)
            return challenge;




      }
    }
    /*getChallengeById(id:string | null): Observable<Challenge[]> {
        return this.http.get<Challenge[]>(this.challengesUrl).pipe(
            map(challenges => {
                if(!Array.isArray(challenges)) {
                    throw new Error('Invalid challenge data');
                }
                return challenges.find(challenge  => challenge.id_challenge === id);
            })
        );

}
}



    /*jsonData!: any[];
    challenges: Challenge[] = [];

    constructor(private http: HttpClient) { }

    getAllChallenges():Observable<Challenge[]>{
        /*        return this.http.get(`${environment.BACKEND_BASE_URL}${environment.BACKEND_ALL_CHALLENGES}`,
                    {
                        headers: {
                            'Content-Type': 'application/dummy'
                        }
                    });*/
        /*return this.http.get<Challenge[]>('../assets/dummy/data-challenge.json',
            {
                headers: {
                    'Content-Type': 'application/dummy'
                }
            });
    }

    /*getChallengeById(id: string | null ): Challenge | undefined {
        console.log(id);
        console.log(this.challenges);
        return this.challenges.find(challenge => challenge.id_challenge === id);
      }*/
      /*getChallengeById(id: string): Observable<Challenge> {
        const url = `https://example.com/challenges/${id}`;
      
        return this.http.get<Challenge>(url);
      }
      
   
    getJsonData() {
       this.getAllChallenges().subscribe(data => {
            this.challenges = data;
            console.log(this.challenges);

        });
    }*/
   
//}
