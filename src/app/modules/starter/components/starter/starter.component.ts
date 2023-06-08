import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {StarterService} from "../../../../services/starter.service";
import {DataChallenge} from "../../../../models/data-challenge.model";
import {Challenge} from "../../../../models/challenge.model";
import { filterChallenge } from './../../../../models/filter-challenge.model';


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
  filters!: filterChallenge;
  sortBy: string = "popularity";


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private starterService: StarterService
              ) {

    this.params$ = this.activatedRoute.params.subscribe(params => {

    });

  }

  ngOnInit(): void {
    this.loadMasterData();
    console.log(this.challenges);
    console.dir(this.challenges);
  }

  ngOnDestroy() {
    if (this.params$ != undefined) this.params$.unsubscribe();
  }

  loadMasterData() {
      this.challengesSubs$ = this.starterService.getAllChallenges().subscribe(resp => {
      this.dataChallenge = new DataChallenge(resp);
      this.challenges = this.dataChallenge.challenges;
    });

  }
  getChallengeFilters(filters: filterChallenge){
    console.log('llamada componente padre desde emitter')
    this.filters = filters;
    //TODO: llamar al endpoint
  }
  changeSort(newSort: string){
    if(newSort != this.sortBy){
      this.sortBy = newSort;
      //TODO: llamar al endpoint
    }
  }
  
}
