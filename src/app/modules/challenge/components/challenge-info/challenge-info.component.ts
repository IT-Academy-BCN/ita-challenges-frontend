import { Component } from '@angular/core';

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss']
})
export class ChallengeInfoComponent {

  solutions = [{solutionName: 'dummy1'}, {solutionName: 'dummy2'}];

  constructor() {
    
  }

}
