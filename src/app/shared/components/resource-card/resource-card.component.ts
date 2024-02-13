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

}