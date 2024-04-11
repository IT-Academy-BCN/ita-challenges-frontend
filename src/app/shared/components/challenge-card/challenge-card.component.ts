import { Component, Input } from '@angular/core'
import { StarterService } from '../../../services/starter.service'
import { AdditionalPropChallenge } from './../../../models/challenge-add-prop.model';

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.scss'],
  providers: []
})
export class ChallengeCardComponent {
  constructor (private readonly starterService: StarterService) {}

  @Input() title: AdditionalPropChallenge[] = []
  @Input() languages: any = []
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() popularity!: number
  @Input() id = ''
}
