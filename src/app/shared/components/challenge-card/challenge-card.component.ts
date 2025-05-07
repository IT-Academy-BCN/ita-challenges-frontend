import { Component, Input, inject, OnInit } from '@angular/core'
import { StarterService } from '../../../services/starter.service'
import { TranslateService } from '@ngx-translate/core'
import { ChallengeService } from '../../../services/challenge.service'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.scss'],
  providers: []
})
export class ChallengeCardComponent {
  private readonly starterService = inject(StarterService)
  private readonly translate = inject(TranslateService)
  private readonly challengeService = inject(ChallengeService)
  private readonly authService = inject(AuthService)

  @Input() title: string = ''
  @Input() languages: any = []
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() popularity!: number
  @Input() id = ''
  @Input() favorites_count: number = 0
  isFavorite: boolean = false;

  get currentLang (): string {
    return this.translate.currentLang
  }

  toggleFavorite (event: MouseEvent): void {
    event.stopPropagation()
    if (!this.authService.isUserLoggedIn()) {
      return
    }
    if (this.isFavorite) {
      this.challengeService.removeFromFavorites(this.id).subscribe({
        next: response => {
          this.isFavorite = false
          this.favorites_count = response.timesFavorited
          console.log('Favorite removed:', response)
        },
        error: error => {
          console.error('Error removing favorite:', error)
        }
      })
    } else {
      this.challengeService.addToFavorites(this.id).subscribe({
        next: response => {
          this.isFavorite = true
          this.favorites_count = response.timesFavorited
          console.log('Favorite added:', response)
        },
        error: error => {
          console.error('Error adding favorite:', error)
        }
      })
    }
  }
}
