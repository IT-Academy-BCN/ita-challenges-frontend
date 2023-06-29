import { Component, Input} from '@angular/core';
import { StarterService } from '../../../services/starter.service';


@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss'],
  providers: [StarterService]
})
export class ChallengeComponent {

  constructor(private starterService: StarterService){}

  @Input() idChallenge = "";
  @Input() title = "";
  @Input() languages: any = [];
  @Input() creation_date!: Date;
  @Input() level = "";
  @Input() popularity!: number;
  @Input() id:any  = [];
 

  challenge_id:string | undefined
  challenge_title: string | undefined
  challenge_language: number | undefined
  challenge_date: Date | undefined
  challenge_level: string | undefined
  challenge_popularity: number | undefined



  ngOnInit(){
    this.challenge_id = this.idChallenge;
    this.challenge_title = this.title;
    this.challenge_language = this.languages.id_laguage;
    this.challenge_date = this.creation_date;
    this.challenge_level = this.level;
    this.challenge_popularity = this.popularity;
  }
}
 