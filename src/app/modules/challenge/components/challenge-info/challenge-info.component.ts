import { Component, Input } from '@angular/core';
import { ChallengeDetails } from 'src/app/models/challenge-details.model';
import { ChallengeService } from 'src/app/services/challenge.service';

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


  description: string | undefined
  examples: any = []
  example_text: string |undefined
  example_id: string | undefined
  notes: string | undefined


  ngOnInit(){
    //this.example_text = this.details.examples.example_text;
    this.description = this.details.description;
    this.examples = this.details.examples;
    this.example_text = this.examples;
    this.example_id = this.examples.example_id;
    this.notes = this.details.notes;
  }









}
