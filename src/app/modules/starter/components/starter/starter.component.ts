import { FilterChallenge } from './../../../../models/filter-challenge.model';
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
  filters!: FilterChallenge;
  sortBy: string = "popularity";
  challenge = Challenge;

  page: number = 1;
  totalPages!: number;
  numChallenges!: number;
  pageSize: number = 10;
  listChallenges: any;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private starterService: StarterService
              ) {

    this.params$ = this.activatedRoute.params.subscribe(params => {

    });

  }

  ngOnInit(): void {
    this.getChallengesByPage(this.page);
  }

  ngOnDestroy() {
    if (this.params$ != undefined) this.params$.unsubscribe();
    if (this.challengesSubs$ != undefined) this.challengesSubs$.unsubscribe();
  }

  getChallengesByPage(page: number) {
    this.challengesSubs$ = this.starterService.getAllChallenges(page, this.pageSize).subscribe(resp => {
      this.dataChallenge = new DataChallenge(resp);
      this.challenges = this.dataChallenge.challenges;
      this.numChallenges = this.challenges.length;
      this.totalPages = Math.ceil(this.numChallenges / this.pageSize);

      const startIndex = (page -1) * 10;
      const endindex = startIndex + 10;
      this.listChallenges = this.challenges.slice(startIndex, endindex);
      
      return this.listChallenges;
    });
  }

  goToPage(page: number){
    this.page = page;
    this.getChallengesByPage(page);
  }

  getChallengeFilters(filters: FilterChallenge){
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
