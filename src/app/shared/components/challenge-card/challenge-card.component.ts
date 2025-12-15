import { Component, Input, inject, OnInit } from '@angular/core'
import { StarterService } from '../../../services/starter.service'
import { TranslateService } from '@ngx-translate/core'
import { ChallengeService } from '../../../services/challenge.service'
import { AuthService } from 'src/app/services/auth.service'
import { take } from 'rxjs/operators'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'


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
  public userRole: string | null = null
  public SolutionStatus = SolutionStatus;


  @Input() title: string = ''
  @Input() languages: any = []
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() popularity!: number
  @Input() id = ''
  @Input() favorites_count: number = 0
  @Input() isFavorite: boolean = false
  @Input() isBookmarked: boolean = false
  @Input() bookmarks_count: number = 0
  @Input() challenge_timesSolved: number = 0
  @Input() solutionStatus?: SolutionStatus;


  ngOnInit(): void {
    this.authService.getUserRole().pipe(take(1)).subscribe((role) => {
      this.userRole = role;
    });
  }

  get currentLang(): string {
    return this.translate.currentLang
  }

  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation()
    if (!this.authService.isUserLoggedIn()) {
      return
    }
    if (this.isFavorite) {
      this.challengeService.removeFromFavorites(this.id).subscribe({
        next: response => {
          this.isFavorite = response.favorite
          this.favorites_count = response.timesFavorited
        },
        error: error => {
          console.error('Error removing favorite:', error)
        }
      })
    } else {
      this.challengeService.addToFavorites(this.id).subscribe({
        next: response => {
          this.isFavorite = response.favorite
          this.favorites_count = response.timesFavorited
        },
        error: error => {
          console.error('Error adding favorite:', error)
        }
      })
    }
  }

toggleBookmark(event: MouseEvent): void {
    event.stopPropagation()
    if (!this.authService.isUserLoggedIn()) {
      return
    }
    if (this.isBookmarked) {
      this.challengeService.removeBookmark(this.id).subscribe({
        next: response => {
          this.isBookmarked = response.bookmarked
        },
        error: error => {
          console.error('Error removing bookmark:', error)
        }
      })
    } else {
      this.challengeService.addBookmark(this.id).subscribe({
        next: response => {
          this.isBookmarked = response.bookmarked
        },
        error: error => {
          console.error('Error adding bookmark:', error)
        }
      })
    }
  }

  getStatusTooltip(): string {
    switch (this.solutionStatus) {
      case SolutionStatus.ENDED:
        return 'You have completed this challenge';
      case SolutionStatus.IN_PROGRESS:
        return 'You have a saved solution in progress';
      default:
        return '';
    }
  }

}
