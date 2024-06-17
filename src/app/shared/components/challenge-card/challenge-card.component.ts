import { Component, Input, type OnDestroy, type OnInit, inject } from '@angular/core'
import { StarterService } from '../../../services/starter.service'
import { TranslateService } from '@ngx-translate/core'
import { type Subscription } from 'rxjs'
import { DateFormatterService } from '../../../services/date-formatter.service'

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.scss'],
  providers: []
})
export class ChallengeCardComponent implements OnInit, OnDestroy {
  private readonly starterService = inject(StarterService)
  private readonly dateFormatter = inject(DateFormatterService)
  private readonly translate = inject(TranslateService)
  private translateSubscription!: Subscription
  formattedDate: string = ''

  @Input() title: string = ''
  @Input() languages: any = []
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() popularity!: number
  @Input() id = ''

  ngOnInit (): void {
    this.updateFormattedDate()
    this.translateSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateFormattedDate()
    })
  }

  ngOnDestroy (): void {
    this.translateSubscription.unsubscribe()
  }

  updateFormattedDate (): void {
    this.formattedDate = this.dateFormatter.format(this.creation_date)
  }
}
