import { Component, Input } from '@angular/core';
import { ChallengeService } from 'src/app/services/challenge.service';

@Component({
  selector: 'app-challenge-header',
  templateUrl: './challenge-header.component.html',
  styleUrls: ['./challenge-header.component.scss'],
  providers: [ChallengeService]
})
export class ChallengeHeaderComponent {

  constructor(private challengeService: ChallengeService){}

  @Input() title = "";
  @Input() creation_date!: Date;
  @Input() level = "";

  challenge_title: string | undefined
  challenge_date: Date | undefined
  challenge_level: string | undefined
  
  ngOnInit(){
    this.challenge_title = this.title;
    this.challenge_date = this.creation_date
    this.challenge_level = this.level
  }
}
