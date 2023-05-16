import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit {

  idChallenge!: number;

  constructor(
    private route: ActivatedRoute 
    ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
     
    this.idChallenge = Number(params.get('idChallenge'))  
    });
  }
  
}
