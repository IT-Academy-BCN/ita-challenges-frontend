import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss']
})
export class ChallengeInfoComponent {

  idChallenge!: string;

  constructor(
    private route: ActivatedRoute
  ){}

  ngOnInit(): void{
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idChallenge = String(params.get('idChallenge'))
    });
  }
}
