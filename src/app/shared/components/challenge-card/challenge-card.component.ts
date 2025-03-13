import { Component, Input, inject, OnInit } from '@angular/core'
import { StarterService } from '../../../services/starter.service'
import { TranslateService } from '@ngx-translate/core'
import { ChallengeService } from '../../../services/challenge.service'

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

  @Input() title: string = ''
  @Input() languages: any = []
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() popularity!: number
  @Input() id = ''
  @Input() favorites_count: number = 0
  @Input() isFavorite: boolean = false;

  ngOnInit(): void {
    // Check if challenge is favorited in localStorage
    this.checkFavoriteStatus();
  }

  get currentLang (): string {
    return this.translate.currentLang
  }

  toggleFavorite(event: Event): void {
    event.preventDefault() // Prevent navigation since we're using routerLink
    event.stopPropagation() // Stop event bubbling

    if (!this.id) return;
    
    if (this.isFavorite) {
      this.challengeService.removeFromFavorites(this.id).subscribe({
        next: (response) => {
          this.isFavorite = response.isFavorite;
          this.favorites_count = response.timesFavorited;
        },
        error: (error) => {
          console.error('Error removing from favorites:', error);
        },
      });
    } else {
      this.challengeService.addToFavorites(this.id).subscribe({
        next: (response) => {
          this.isFavorite = response.isFavorite;
          this.favorites_count = response.timesFavorited;
        },
        error: (error) => {
          console.error('Error adding to favorites:', error);
        },
      });
    }
  }

  // Check if the challenge is in favorites
  private checkFavoriteStatus(): void {
    if (!this.id) return;
    // For mock purposes, we'll check localStorage
    const isFavorited = localStorage.getItem(`is_favorite_${this.id}`);
    this.isFavorite = isFavorited === 'true';
  }
}
