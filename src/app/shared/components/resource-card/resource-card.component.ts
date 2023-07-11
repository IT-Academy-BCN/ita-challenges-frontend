import { Component, Input } from '@angular/core';
import { ChallengeService } from '../../../services/challenge.service';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss'],
  providers: [ChallengeService]
})
export class ResourceCardComponent {
  constructor(private challengeService: ChallengeService){}

  @Input() author = "";
  @Input() date!: Date;
  @Input() id = "";
  @Input() description = "";


  resource_author: string | undefined
  resource_date: Date | undefined
  resource_id: string | undefined
  resource_description: string | undefined

  ngOnInit(){
    this.resource_author = this.author;
    this.resource_date = this.date;
    this.resource_id = this.id;
    this.resource_description = this.description;
  }

}