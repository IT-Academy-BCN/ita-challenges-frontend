import { Component, Input } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import {DataChallenge} from "../../../../models/data-challenge.model";
import { Challenge } from "../../../../models/challenge.model";
import { ChallengeService } from '../../../../services/challenge.service';
import { Language } from 'src/app/models/language.model';

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
  challengeSubs$!: Subscription;
  
  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
  ){ }
    
  @Input() related: any = [];


  title = "";
  creation_date!: Date;
  level = "";
  popularity!: number;
  languages: Language[] = [];
  id = "";

  ngOnInit(){   
    this.loadMasterData(this.idChallenge);
    console.log(this.related);
    console.log(this.title)
  }

  ngOnDestroy() {
    if(this.challengeSubs$ != undefined) this.challengeSubs$.unsubscribe();
  }

  loadMasterData(id: string) {
    this.challengeSubs$ = this.challengeService.getChallengeById(this.idChallenge).subscribe((challenge) => {
      this.challenge = new Challenge(challenge); 
      this.title = this.challenge.challenge_title;
      this.creation_date = this.challenge.creation_date;
      this.level = this.challenge.level;
      this.popularity = this.challenge.popularity;
      this.languages = this.challenge.languages;
      this.id = this.related;      
    });
  }
}


