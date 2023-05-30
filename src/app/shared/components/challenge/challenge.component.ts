import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Challenge } from 'src/app/models/challenge.model';
import { DataChallenge } from 'src/app/models/data-challenge.model';
import { StarterService } from 'src/app/services/starter.service';
import { StarterComponent } from 'src/app/modules/starter/components/starter/starter.component';


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
