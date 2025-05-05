import { Component, Input, inject, OnInit } from '@angular/core'
import { StarterService } from '../../../services/starter.service'
import { TranslateService } from '@ngx-translate/core'
import { ChallengeService } from '../../../services/challenge.service'
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.scss'],
  providers: []
})
export class ChallengeCardComponent implements OnInit {
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

  ngOnInit (): void {
    if (!this.authService.isUserLoggedIn()) {
      return
    }
    this.challengeService.getFavoriteStatus(this.id).subscribe({
      next: resp => {
        this.isFavorite = resp.isFavorite
        this.favorites_count = resp.timesFavorited
      },
      error: err => {
        console.error('Error fetching favorite status:', err)
        this.isFavorite = false
      }
    })
  }

  get currentLang (): string {
    return this.translate.currentLang
  }

  // Check if the challenge is in favorites
  private checkFavoriteStatus(): void {
    if (!this.id) return;
    
    // For mock purposes, we'll check localStorage
    const isFavorited = localStorage.getItem(`is_favorite_${this.id}`);
    this.isFavorite = isFavorited === 'true';
    
    // Also update the favorites count from localStorage if available
    const storedCount = localStorage.getItem(`favorites_count_${this.id}`);
    if (storedCount) {
      this.favorites_count = parseInt(storedCount, 10);
    }
  }

  toggleFavorite (event: MouseEvent): void {
    event.stopPropagation()
    if (!this.authService.isUserLoggedIn()) {
      return
    }
    if (this.isFavorite) {
      this.challengeService.addToFavorites(this.id).subscribe({
        next: response => {
          this.isFavorite = response.isFavorite
          this.favorites_count = response.timesFavorited;
        },
        error: error => {
          this.isFavorite = false
          console.error('Error adding favorite:', error)
        }
      })
    } else {
    // TODO: Implement removeFromFavorites functionality
    }
  }
}
