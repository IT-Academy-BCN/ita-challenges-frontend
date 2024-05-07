import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Challenges } from "../models/challenges.interface";

@Injectable({
  providedIn: "root",
})
export class RelatedService {
  constructor(private http: HttpClient) {}

  getRelatedChallenges(challengeId: string): Observable<Challenges> {
    return this.http.get<Challenges>(
      `/itachallenge/api/v1/challenge/challenges/${challengeId}/related`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
