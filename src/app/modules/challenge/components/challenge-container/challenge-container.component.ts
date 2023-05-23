import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-challenge-container',
  templateUrl: './challenge-container.component.html',
  styleUrls: ['./challenge-container.component.scss']
})
export class ChallengeContainerComponent {
  idChallenge!: string | null;
  params$!: Subscription

  constructor(
    private route: ActivatedRoute
  ){
    this.params$ =  this.route.paramMap.subscribe((params: ParamMap) => {
      this.idChallenge = params.get('idChallenge')
      console.log(this.idChallenge)
    });
  }

  ngOnDestroy() {
    if (this.params$ != undefined) this.params$.unsubscribe();
  }
}
