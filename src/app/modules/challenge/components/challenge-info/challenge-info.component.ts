import { Component, Input } from '@angular/core';
import { ChallengeDetails } from 'src/app/models/challenge-details.model';
import { Example } from 'src/app/models/challenge-example.model';
import { Language } from 'src/app/models/language.model';
import { ChallengeService } from '../../../../services/challenge.service';
import { Subscription } from 'rxjs';
import {DataChallenge} from "../../../../models/data-challenge.model";
import { Challenge } from "../../../../models/challenge.model";

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss'],
  providers: [ChallengeService]
})
export class ChallengeInfoComponent {
  constructor(private challengeService: ChallengeService){}

  @Input() related: any = [];
  @Input() resources: any = [];
  @Input() details!: ChallengeDetails;
  @Input() solutions: any = [];
  @Input() description!: string;
  @Input() examples: Example[] = [];
  @Input() notes!: string;
  @Input() popularity!: number;
  @Input() languages: Language[] = []



  idChallenge!: string | any;
  params$!: Subscription;
  jsonData: Challenge[] = [];
  challenge!: Challenge;
  dataChallenge!: DataChallenge;
  challenges: Challenge[] = [];
  challengeSubs$!: Subscription;
  
  related_title = "";
  related_creation_date!: Date;
  related_level = "";
  related_popularity!: number;
  related_languages: Language[] = [];
  related_id = this.related;

  ngOnInit(){
    this.loadRelatedChallenge(this.related_id);
  }




  loadRelatedChallenge(id: string) {
    this.challengeSubs$ = this.challengeService.getChallengeById(id).subscribe((challenge) => {
      this.challenge = new Challenge(challenge); 
      this.related_title = this.challenge?.challenge_title;
      this.related_creation_date = this.challenge?.creation_date;
      this.related_level = this.challenge?.level;
      this.related_popularity = this.challenge.popularity;
      this.related_languages = this.challenge.languages;
      this.related_id = this.related;      
    });
  }


}