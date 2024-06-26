import { Component, Input, type OnInit, inject } from '@angular/core'
import { StarterService } from '../../../services/starter.service'

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.scss'],
  providers: []
})
export class ChallengeCardComponent implements OnInit {
  constructor () {
    console.log('constructor')
  }

  ngOnInit (): void {
    console.log('ngOnInit')
  }

  private readonly starterService = inject(StarterService)

  @Input() title: string = ''
  @Input() languages: any = []
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() popularity!: number
  @Input() id = ''
}
