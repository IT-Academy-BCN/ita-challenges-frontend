import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {StarterService} from "../../../services/starter.service";

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent {

  params$!: Subscription;
  challenges$!: Subscription;

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
    this.challenges$ = this.starterService.getAllChallenges().subscribe(resp => {
      console.log(resp);

    });

  }

}
