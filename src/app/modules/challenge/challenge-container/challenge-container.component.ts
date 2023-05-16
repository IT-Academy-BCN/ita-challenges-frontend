import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataChallenge } from 'src/app/models/data-challenge.model';
import { Challenge } from 'src/app/models/challenge.model';
import { ChallengeService } from 'src/app/services/challenge.service';

@Component({
  selector: 'app-challenge-container',
  templateUrl: './challenge-container.component.html',
  styleUrls: ['./challenge-container.component.scss']
})
export class ChallengeContainerComponent {

  dataChallenge!: DataChallenge;
  challenges: Challenge[] = [];
  params$!: Subscription;
  challengesSubs$!: Subscription;
  idChallenge!: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private challengeService: ChallengeService){
   
    this.params$ = this.activatedRoute.params.subscribe(params => {
      this.idChallenge = params['idChallenge']
    });
  }

  ngOnInit(): void {
    this.loadMasterData();
  }

  ngOnDestroy(){
    if(this.params$ != undefined) this.params$.unsubscribe();
  }

  loadMasterData(){
    this.challengesSubs$ = this.challengeService.getChallenge().subscribe(resp => {
      this.dataChallenge = new DataChallenge(resp);
      this.challenges = this.dataChallenge.challenges
  
      //TODO: remove this
      console.log(this.challenges);
    });
  }


}
