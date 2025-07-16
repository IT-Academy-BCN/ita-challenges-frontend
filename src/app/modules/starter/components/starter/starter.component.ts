import { type FilterChallenge } from './../../../../models/filter-challenge.model'
import { Component, Inject, type OnInit, ViewChild, type ElementRef, ChangeDetectorRef, inject } from '@angular/core'
import { type Subscription } from 'rxjs'
import { StarterService } from '../../../../services/starter.service'
import { Challenge } from '../../../../models/challenge.model'
import { type FiltersModalComponent } from 'src/app/modules/modals/filters-modal/filters-modal.component'
import { TranslateService } from '@ngx-translate/core'
import { AuthService } from 'src/app/services/auth.service'
import * as bootstrap from 'bootstrap'
import { ChallengeService } from 'src/app/services/challenge.service'
import { SolutionService } from 'src/app/services/solution.service'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  providers: []
})
export class StarterComponent implements OnInit {
  @ViewChild('modal') private readonly modalContent!: FiltersModalComponent
  @ViewChild('challenge') challengesContainer!: ElementRef
  @ViewChild('challengeFormModal') challengeFormModal!: ElementRef

  challenges: Challenge[] = []
  challengesSubs$!: Subscription
  sortedChallengesSubs$!: Subscription
  filteredChallengesSubs$!: Subscription
  userRoleSubs$!: Subscription
  filters: FilterChallenge = { languages: [], levels: [], progress: [] }
  sortBy: string = ''
  challenge = Challenge

  listChallenges: Challenge[] = []

  selectedSort: string = ''
  isAscending: boolean = false

  isMobile: boolean = window.innerWidth < 768

  isAdmin: boolean = false
  favoriteChallenges: string[] = []
  timesSolved: number = 0
  bookmarkedChallenges: string[] = []
  solutionStatusMap: Record<string, 'IN_PROGRESS' | 'ENDED'> = {};
  private readonly solutionService = inject(SolutionService)
  constructor (
    @Inject(StarterService) private readonly starterService: StarterService,
    @Inject(TranslateService) readonly translate: TranslateService,
    private readonly _authService: AuthService,
    private readonly challengeService: ChallengeService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit (): void {
    this.getChallenge()
    this.userRoleSubs$ = this._authService.getUserRole().subscribe(role => {
      this.isAdmin = role === 'ADMIN'
      this.cd.detectChanges()
      if (!this.isAdmin) {
    this.fetchUserSolutionsStatus();
  }
    })
    if (this._authService.isUserLoggedIn()) {
      this._authService.getUserId().subscribe(userId => {
        if (userId !== null && userId !== '') {
          this.challengeService.getUserFavorites(userId).subscribe({
            next: (favorites: any[]) => {
              this.favoriteChallenges = favorites
            },
            error: (err) => {
              console.error('Error getting favorites:', err)
            }
          })
          this.challengeService.getUserBookmarks(userId).subscribe({
            next: (bookmarks: string[]) => {
              this.bookmarkedChallenges = bookmarks
            },
            error: (err) => {
              console.error('Error getting bookmarks:', err)
            }
          })
        }
      })
    }
  }

  ngOnDestroy (): void {
    if (this.challengesSubs$ !== undefined) this.challengesSubs$.unsubscribe()
    if (this.filteredChallengesSubs$ !== undefined) this.filteredChallengesSubs$.unsubscribe()
    if (this.sortedChallengesSubs$ !== undefined) this.sortedChallengesSubs$.unsubscribe()
    if (this.userRoleSubs$ !== undefined) this.userRoleSubs$.unsubscribe()
  }

  isFavoriteChallenge (challengeId: string): boolean {
    const result = this.favoriteChallenges.includes(challengeId)
    return result
  }

  isBookmarkedChallenge (challengeId: string): boolean {
    return this.bookmarkedChallenges.includes(challengeId)
  }

  getChallenge (): void {
    this.challengesSubs$ = this.starterService.getAllChallenges().subscribe({
      next: (resp) => {
        this.listChallenges = resp.results
        this.refreshChallengeList()
      },
      error: (err) => {
        console.error('Error al obtener los desafíos:', err)
      }
    })
  }

  refreshChallengeList (): void {
    if (this.filters.languages.length > 0 || this.filters.levels.length > 0 || this.filters.progress.length > 0) {
      this.getChallengeFilters(this.filters)
    } else {
      if (Array.isArray(this.listChallenges) && this.listChallenges.length > 0) {
        this.challenges = this.listChallenges
        if (this.sortBy !== '') {
          this.sortedChallengesSubs$ = this.starterService.orderBySort(this.sortBy, this.listChallenges, 0, this.listChallenges.length, this.isAscending).subscribe(sortedResp => {
            this.challenges = sortedResp
          })
        }
      } else {
        this.challenges = []
      }
    }
  }

  openModal (): void {
    this.modalContent.open()
  }

  getChallengeFilters (filters: FilterChallenge): void {
    this.filters = filters

    this.filteredChallengesSubs$ = this.starterService.getAllChallengesFiltered(this.filters, this.listChallenges).subscribe((filteredResp: Challenge[]) => {
      this.challenges = filteredResp
    })

    if (this.sortBy !== '') {
      this.sortedChallengesSubs$ = this.starterService.orderBySort(this.sortBy, this.challenges, 0, this.listChallenges.length, this.isAscending).subscribe(sortedResp => {
        this.challenges = sortedResp
      })
    }
  }

  changeSort (newSort: string): void {
    this.sortBy = newSort
    localStorage.setItem('sortBy', newSort)
    if (newSort === 'popularity' || newSort === 'creation_date') {
      if (this.selectedSort === newSort) {
        this.isAscending = !this.isAscending
      } else {
        this.isAscending = false
        this.selectedSort = newSort
      }
      this.refreshChallengeList()
    }
  }
  fetchUserSolutionsStatus(): void {
  this.solutionService.fetchUserSolution().subscribe({
    next: (solutions) => {
      this.solutionStatusMap = solutions.reduce((acc, sol) => {
        acc[sol.uuid_challenge] = sol.status;
        return acc;
      }, {} as Record<string, SolutionStatus>);
    },
    error: (err) => {
      console.error('Error fetching user solutions:', err);
    }
  });
}

}
