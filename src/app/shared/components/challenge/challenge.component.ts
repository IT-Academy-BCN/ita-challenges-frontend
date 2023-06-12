import { Component, Input} from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StarterService } from '../../../services/starter.service';


@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss'],
  providers: [StarterService]
})
export class ChallengeComponent {

  constructor(private starterService: StarterService){}

  @Input() challenge_title = "";
  @Input() languages: any = [];
  @Input() creation_date!: Date;
  @Input() level = "";
  @Input() popularity!: number;

}
