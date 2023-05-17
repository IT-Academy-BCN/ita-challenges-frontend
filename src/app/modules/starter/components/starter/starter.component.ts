import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {StarterService} from "../../../../services/starter.service";
import {DataChallenge} from "../../../../models/data-challenge.model";
import {Challenge} from "../../../../models/challenge.model";

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent {

  dataChallenge!: DataChallenge;
  challenges: Challenge[] = [];
  params$!: Subscription;
  challengesSubs$!: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private starterService: StarterService) {

    this.params$ = this.activatedRoute.params.subscribe(params => {

    });

  }

  ngOnInit(): void {
    this.loadMasterData();
  }

  ngOnDestroy() {
    if (this.params$ != undefined) this.params$.unsubscribe();
  }

  loadMasterData() {
    this.challengesSubs$ = this.starterService.getAllChallenges().subscribe(resp => {
      this.dataChallenge = new DataChallenge(resp);
      this.challenges = this.dataChallenge.challenges;

      //TODO: remove this
      console.log(this.challenges);
    });

  }

}
