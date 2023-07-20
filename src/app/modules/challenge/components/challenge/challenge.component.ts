import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Challenge } from "../../../../models/challenge.model";
import { ChallengeService } from '../../../../services/challenge.service';
import { ChallengeDetails } from 'src/app/models/challenge-details.model';
import { Solution } from 'src/app/models/solution.model';
import { Resource } from 'src/app/models/resource.model';
import { Example } from 'src/app/models/challenge-example.model';
import { Language } from 'src/app/models/language.model';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent {
  idChallenge: string | any;
  params$!: Subscription;
  challenge!: Challenge;
  challengeSubs$!: Subscription;
  dataChallenge!: Challenge;

  title = "";
  creation_date!: Date;
  level = "";
  details!: ChallengeDetails;
  related: string [] = [];
  resources:  Resource[] = [];
  solutions:  Solution[] = [];
  description = "";
  examples: Example[] = [];
  notes = "";
  popularity!: number;
  languages: Language[] = [];
  

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
  ){
    this.params$ =  this.route.paramMap.subscribe((params: ParamMap) => {
      this.idChallenge = params.get('idChallenge')
      console.log(this.idChallenge)
    });
  }

  ngOnInit(){
    this.loadMasterData(this.idChallenge);
    console.log(this.idChallenge)
  }

  ngOnDestroy() {
    if (this.params$ != undefined) this.params$.unsubscribe();
    if(this.challengeSubs$ != undefined) this.challengeSubs$.unsubscribe();
  }


  loadMasterData(id: string) {
    this.challengeSubs$ = this.challengeService.getChallengeById(this.idChallenge).subscribe((challenge) => {
      this.challenge = new Challenge(challenge); 
      this.title = this.challenge.challenge_title;
      this.creation_date = this.challenge.creation_date;
      this.level = this.challenge.level;
      this.details = this.challenge.details;
      this.related = this.challenge.related;
      this.resources = this.challenge.resources;
      this.solutions = this.challenge.solutions;
      this.description = this.challenge.details.description
      this.examples = this.challenge.details.examples
      this.notes = this.challenge.details.notes;
      this.popularity = this.challenge.popularity;
      this.languages = this.challenge.languages;
      console.log(this.title);
      console.log(this.description)
    });
  }
}
