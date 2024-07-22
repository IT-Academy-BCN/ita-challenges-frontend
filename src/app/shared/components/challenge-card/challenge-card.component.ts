import { Component, Input, inject } from '@angular/core'
import { StarterService } from '../../../services/starter.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.scss'],
  providers: []
})
export class ChallengeCardComponent {
  private readonly starterService = inject(StarterService)
  private readonly translate = inject(TranslateService)

  @Input() title: string = ''
  @Input() languages: any = []
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() popularity!: number
  @Input() id = ''

  get currentLang (): string {
    return this.translate.currentLang
  }
}
