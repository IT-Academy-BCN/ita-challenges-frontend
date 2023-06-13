import { Component, Input } from '@angular/core';
import { ChallengeDetails } from 'src/app/models/challenge-details.model';
import { Example } from 'src/app/models/challenge-example.model';
import { Language } from 'src/app/models/language.model';
import { ChallengeService } from '../../../../services/challenge.service';

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss'],
  providers: [ChallengeService]
})
export class ChallengeInfoComponent {
  constructor(private challengeService: ChallengeService){}

  @Input() related: any = [];
  @Input() resources: any = [];
  @Input() details!: ChallengeDetails;
  @Input() solutions: any = [];
  @Input() description!: string;
  @Input() examples: Example[] = [];
  @Input() notes!: string;
  @Input() popularity!: number;
  @Input() languages: Language[] = []

  challenge_description: string | undefined
  challenge_examples: any = []
  example_text: string |undefined
  example_id: string | undefined
  challenge_notes: string | undefined
  challenge_popularity: number | undefined
  challenge_languages: any = []



  ngOnInit(){
    this.challenge_description = this.description;
    this.challenge_examples = this.examples;
    this.challenge_notes = this.notes;
    this.challenge_popularity = this.popularity;
    this.challenge_languages = this.languages;
  }









}
