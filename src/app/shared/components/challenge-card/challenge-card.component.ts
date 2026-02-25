import { Component, Input, inject, OnInit, computed, input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ChallengeService } from '../../../services/challenge.service'
import { AuthService } from 'src/app/services/auth.service'
import { take } from 'rxjs/operators'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'
import { Tag } from 'src/app/models/tag-response.interface'

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.scss'],
  providers: []
})
export class ChallengeCardComponent implements OnInit {
  private readonly translate = inject(TranslateService)
  private readonly challengeService = inject(ChallengeService)
  private readonly authService = inject(AuthService)
  public userRole: string | null = null
  public SolutionStatus = SolutionStatus

  public readonly resolvedTags = computed(() => {
    const dictionary = this.challengeService.tagMap()
    return this.tagIds()
      .map(id => dictionary[id])
      .filter((tag): tag is Tag => tag !== undefined)
  })


  @Input() title: string = ''
  @Input() languages: any = []
  @Input() description: string = ''
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() popularity!: number
  @Input() id = ''
  public readonly tagIds = input<string[]>([])
  @Input() favorites_count: number = 0
  @Input() isFavorite: boolean = false
  @Input() isBookmarked: boolean = false
  @Input() bookmarks_count: number = 0
  @Input() challenge_timesSolved: number = 0
  @Input() solutionStatus?: SolutionStatus

  ngOnInit(): void {

    this.authService.getUserRole().pipe(take(1)).subscribe((role) => {
      this.userRole = role
    })
  }

  get descriptionPreview (): string {
    const raw = this.description ?? ''

    let text = raw
    if (raw.includes('<')) {
      const doc = new DOMParser().parseFromString(raw, 'text/html')
      text = doc.body?.textContent ?? ''
    }

    text = text.replaceAll(/\s+/g, ' ').trim()
    const maxLen = 100
    return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text
  }

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
  // Logic will be implemented in #205
}
}
