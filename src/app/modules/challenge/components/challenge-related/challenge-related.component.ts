import { Component, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import {DataChallenge} from "../../../../models/data-challenge.model";
import { Challenge } from "../../../../models/challenge.model";
import { ChallengeService } from 'src/app/services/challenge.service';
import { StarterService } from 'src/app/services/starter.service';

@Component({
  selector: 'app-challenge-related',
  templateUrl: './challenge-related.component.html',
  styleUrls: ['./challenge-related.component.scss']
})
export class ChallengeRelatedComponent {
  idChallenge!: string | any;
  params$!: Subscription;
  jsonData: Challenge[] = [];
  challenge!: Challenge;
  dataChallenge!: DataChallenge;
  challenges: Challenge[] = [];
  challengesSubs$!: Subscription;
  
  

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private starterService: StarterService
  ){ }
   @Input() related: any = [];

   challenge_title: string | undefined
   challenge_date: Date | undefined
   challenge_level: string | undefined 

  ngOnInit(){
    this.idChallenge = this.related;
    console.log(this.idChallenge)
   
    this.loadMasterData(this.idChallenge);
  

  }
  loadMasterData(id: string) {
    this.challengesSubs$ = this.starterService.getAllChallenges().subscribe(resp => {
      this.dataChallenge = new DataChallenge(resp);
      this.challenges = this.dataChallenge.challenges;
   
    this.challengeService.getChallenge(id, this.challenges)
  .subscribe((challenge: Challenge) => {
    this.challenge = challenge;
    console.log(this.challenge)
    this.challenge_title = this.challenge.challenge_title;
    this.challenge_date = this.challenge.creation_date;
    this.challenge_level = this.challenge.level
  }); 
});
}
  
  ngOnDestroy() {
    if (this.params$ != undefined) this.params$.unsubscribe();
  }
}


