import { Component, inject, type OnInit, type OnDestroy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core'
import { ActivatedRoute, Router, type ParamMap } from '@angular/router'
import { type Subscription } from 'rxjs'
import { Challenge } from '../../../../models/challenge.model'
import { ChallengeService } from '../../../../services/challenge.service'
import { type ChallengeDetails } from 'src/app/models/challenge-details.model'
import { type SolutionResults } from 'src/app/models/solution-results.model'
import { type Resource } from 'src/app/models/resource.model'
import { type Example } from 'src/app/models/challenge-example.model'
import { type Language } from 'src/app/models/language.model'
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'
import { AuthService } from 'src/app/services/auth.service'
import { SolutionService } from 'src/app/services/solution.service'
import { UserSolution } from 'src/app/models/user-solution.interface'

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit, OnDestroy {
  idChallenge: string = ''
  params$!: Subscription
  challenge: Challenge | null = null
  challengeSubs$!: Subscription
  dataChallenge!: Challenge
  title: string = ''
  creation_date!: Date
  level = ''
  detail!: ChallengeDetails
  related: string[] = []
  resources: Resource[] = []
  solutions: SolutionResults[] = []
  description: string = ''
  examples: Example[] = []
  notes: string = ''
  popularity!: number
  languages: Language[] = []
  activeId: ChallengeTab = ChallengeTab.DETAILS
  challengeTab = ChallengeTab;
  timesSolved?: number
  isEditorChallengeVisible = false
  challengeStarted: boolean = false
  favoriteChallenges: string[] = []
  bookmarkedChallenges: string[] = []
  isChallengeStatementVisible = true;
  isFavorite: boolean = false
  userSolution: UserSolution | null = null;
  solutionText: string = '';
  status: string = 'IN_PROGRESS'; 
  languageId: string = '';

  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly challengeService = inject(ChallengeService)
  private readonly _authService = inject(AuthService)
  private readonly solutionService = inject(SolutionService)
  private userId: string = ''
  public solutionState: 'NOT_STARTED' | 'IN_PROGRESS' | 'ENDED' = 'NOT_STARTED'
  public savedSolutionText: string = ''
  public cdr = inject(ChangeDetectorRef)
  @Output() startChallenge = new EventEmitter<boolean>()


  ngOnInit (): void {
    this.params$ = this.route.paramMap.subscribe((params: ParamMap) => {
      this.idChallenge = params.get('idChallenge') ?? ''
      this.loadMasterData(this.idChallenge)
      this.activeId = ChallengeTab.DETAILS
    })

   this._authService.getUserId().subscribe(userId => {
    if (!userId) return
    this.userId = userId
    this.challengeService.getUserBookmarks(userId).subscribe((bookmarks: string[]) => {
    this.bookmarkedChallenges = bookmarks;
    });

    this.challengeService.getUserFavorites(userId).subscribe((favorites: string[]) => {
    this.favoriteChallenges = favorites;
    });
    this.solutionService.fetchUserSolution().subscribe(solutions => {
      const match = solutions.find(
        sol =>
          sol.uuid_challenge === this.idChallenge &&
          sol.uuid_user === this.userId
      )
      if (match) {
        this.savedSolutionText = match.solution_text
        if (match.status === 'IN_PROGRESS') {
          this.solutionState = 'IN_PROGRESS'
        } else if (match.status === 'ENDED') {
          this.solutionState = 'ENDED'
        }
      } else {
        this.solutionState = 'NOT_STARTED'
      }
    })
  })
}

  isFavoriteChallenge (challengeId: string): boolean {
    const result = this.favoriteChallenges.includes(challengeId)
    return result
  }

  isBookmarkedChallenge (challengeId: string): boolean {
    return this.bookmarkedChallenges.includes(challengeId)
  }

onStartChallenge(started: boolean): void {
  this.challengeStarted = started;
  this.isEditorChallengeVisible = started;

  this.status = started ? 'IN_PROGRESS' : 'NOT_STARTED';

  this.startChallenge.emit(started); 
}


  ngOnDestroy (): void {
    if (this.params$ !== undefined) this.params$.unsubscribe()
    if (this.challengeSubs$ !== undefined) this.challengeSubs$.unsubscribe()
  }

  onActiveIdChange (newActiveId: ChallengeTab): void {
    this.activeId = newActiveId
  }

  onFavoritesUpdated(count: number): void {
    if (this.challenge) {
      this.challenge.favorites_count = count;
    }
  }

  loadMasterData (id: string): void {
    this.challengeSubs$ = this.challengeService.getChallengeById(id).subscribe((challenge) => {
      this.challenge = new Challenge(challenge)
      this.title = this.challenge.challenge_title
      this.creation_date = this.challenge.creation_date
      this.level = this.challenge.level
      this.detail = this.challenge.detail
      this.description = this.challenge.detail.description
      this.examples = this.challenge.detail?.examples
      this.notes = this.challenge.detail.notes
      this.popularity = this.challenge.popularity
      this.languages = this.challenge.languages
      this.timesSolved = this.challenge.timesSolved
      this.languageId = this.languages[0]?.id_language ?? ''
    })
  }
onChallengeStart(): void {
  this.challengeStarted = true;
  this.isEditorChallengeVisible = true;
  this.isChallengeStatementVisible = false;
}
onContinueChallenge(): void {
  this.challengeStarted = true;
  this.isEditorChallengeVisible = true;
  this.isChallengeStatementVisible = false;

  if (this.userSolution?.solution_text) {
    this.solutionText = this.userSolution.solution_text;
    this.solutionService.solutionText(this.solutionText);
    this.cdr.detectChanges();
  }
}
onEditorSolutionChanged(newText: string): void {
  this.solutionText = newText;
   
}

}
