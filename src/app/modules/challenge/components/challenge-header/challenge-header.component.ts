import { Component, Input, type OnInit, EventEmitter, Output, inject } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component'
import { TranslateService } from '@ngx-translate/core'
import { ChallengeService } from '../../../../services/challenge.service'
import { SolutionService } from 'src/app/services/solution.service'
import { AuthService } from 'src/app/services/auth.service'
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'
import { UserRole } from 'src/app/shared/enums/user-role.enum'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'
type SolutionState = SolutionStatus | 'NOT_STARTED';


@Component({
  selector: 'app-challenge-header',
  templateUrl: './challenge-header.component.html',
  styleUrls: ['./challenge-header.component.scss']
})
export class ChallengeHeaderComponent implements OnInit {
  constructor (
    private readonly router: Router,
    private readonly modalService: NgbModal,
    private readonly translate: TranslateService,
    private readonly route: ActivatedRoute
    
  ) {}
  public SolutionStatus = SolutionStatus;
  public NOT_STARTED = 'NOT_STARTED';
  private readonly challengeService = inject(ChallengeService)
  private readonly solutionService = inject(SolutionService)
  private readonly authService = inject(AuthService);
  public userId: string | null = null;
  public userRole: string | null = null;
  public currentSolutionText: string = '';
  

  challengeTab = ChallengeTab;
  USER_ROLE = UserRole;

  @Input() title = ''
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() activeId!: ChallengeTab
  @Input() idChallenge!: string
  @Input() isEditorChallengeVisible: boolean = false
  @Input() favorites_count: number = 0
  @Input() isFavorite: boolean = false
  @Input() isBookmarked: boolean = false
  @Input() languageId: string = '';
  @Input() timesSolved: number = 0
  @Output() startChallenge = new EventEmitter<boolean>()
  @Output() favoritesUpdated = new EventEmitter<number>()
  @Input() solutionText: string = '';
  @Input() status: string = '';
  @Input() solutionState: SolutionState = 'NOT_STARTED';
  @Input() savedSolutionText: string = '';

  challenge_title: string | undefined = ''
  challenge_date: Date | undefined
  challenge_level: string | undefined

  challengeStarted: boolean = false
  solutionSent: boolean = false
  

  ngOnInit(): void {
  this.challenge_title = this.title;
  this.challenge_date = this.creation_date;
  this.challenge_level = this.level;

  this.route.params.subscribe(params => {
    this.idChallenge = params['idChallenge'];
  });

  this.authService.getUserId().subscribe(userId => {
    if (!userId) {
      console.error("Could not get User ID");
      return;
    }
    this.userId = userId;
    this.loadUserSolutionStatus();
    
  });

  this.authService.getUserRole().subscribe(role => {
    this.userRole = role;
  });
}
 loadUserSolutionStatus(): void {
  this.solutionService.fetchUserSolution().subscribe({
    next: (userSolutions) => {
      const solution = userSolutions.find(
        (sol) =>
          sol.uuid_challenge === this.idChallenge &&
          sol.solution_text?.trim() !== ''
      );

      if (!solution) {
        this.solutionState = 'NOT_STARTED';
        this.challengeStarted = false;
        return;
      }
      this.status = solution.status;
      this.solutionText = solution.solution_text;

        switch (solution.status) {
        case SolutionStatus.IN_PROGRESS:
          this.solutionState = SolutionStatus.IN_PROGRESS;
          this.challengeStarted = false;
          this.solutionText = '';
          break;

        case SolutionStatus.ENDED:
          this.solutionState = SolutionStatus.ENDED;
          this.solutionSent = true;
          this.challengeStarted = true;
          this.activeId = ChallengeTab.SOLUTIONS;
          break;

        default:
          console.warn(`Unhandled solution status: ${solution.status}`);
          this.solutionState = 'NOT_STARTED';
          this.challengeStarted = false;
          break;
      }
    },
    error: (err) => {
      console.error('Error fetching user solutions:', err);
    }
  });
}


  async onStartChallenge (): Promise<void> {
    this.challengeStarted = true
    this.solutionState = SolutionStatus.IN_PROGRESS;
    this.activeId = ChallengeTab.SOLUTIONS
    localStorage.setItem('challengeStarted', JSON.stringify({ id: this.idChallenge, started: true }))

    localStorage.setItem('currentChallengeId', this.idChallenge)

    this.startChallenge.emit(true)

    try {
      await this.router.navigate([`/ita-challenge/challenges/${this.idChallenge}/start`])
    } catch (error) {
      console.error('Error en la navegación:', error)
    }
  }

  openSendSolutionModal (): void {
    const modalRef = this.modalService.open(SendSolutionModalComponent, {
      centered: true,
      size: 'md'
    })
    modalRef.componentInstance.idChallenge = this.idChallenge;
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.status = this.SolutionStatus.ENDED;
    modalRef.componentInstance.solutionText = this.solutionText; 

    modalRef.componentInstance.solutionAccepted.subscribe(() => {
      this.onSolutionAccepted();
    });

    modalRef.componentInstance.timesSolvedUpdated.subscribe((newCount: number) => {
      this.timesSolved = newCount
    })
  }

  onSolutionAccepted(): void {
    this.solutionSent = true; 
    this.activeId = ChallengeTab.SOLUTIONS;
  }

  get currentLang (): string {
    return this.translate.currentLang
  }

  emitStartChallenge (): void {
    this.startChallenge.emit(true)
  }

  startChallengeEvent (): void {
    this.challengeStarted = true
    this.startChallenge.emit(true)
  }

saveChallenge(): void {
  if (!this.idChallenge || !this.languageId || !this.solutionText || !this.userId) {
    console.error(' Missing data to save the solution');
    return;
  }

  this.status = 'IN_PROGRESS';
  this.solutionService.submitSolution(
    this.idChallenge,
    this.languageId,
    this.userId,
    this.status,
    this.solutionText
  ).subscribe({
    next: () => {
      this.solutionState = SolutionStatus.IN_PROGRESS;
    },
    error: (err) => {
      console.error(' Error saving solution', err);
    }
  });
}
  sendSolution (): void {
    this.openSendSolutionModal()
  }

  toggleFavorite (): void {
    if (!this.authService.isUserLoggedIn()) {
      return
    }
    if (this.isFavorite) {
      this.challengeService.removeFromFavorites(this.idChallenge).subscribe({
        next: response => {
          this.isFavorite = response.favorite
          this.favorites_count = response.timesFavorited
          this.favoritesUpdated.emit(this.favorites_count)
        },
        error: error => {
          console.error('Error removing favorite:', error)
        }
      })
    } else {
      this.challengeService.addToFavorites(this.idChallenge).subscribe({
        next: response => {
          this.isFavorite = response.favorite
          this.favorites_count = response.timesFavorited
          this.favoritesUpdated.emit(this.favorites_count)
        },
        error: error => {
          console.error('Error adding favorite:', error)
        }
      })
    }
  }

  toggleBookmark (event: Event): void {
    event.stopPropagation()
    if (!this.authService.isUserLoggedIn()) {
      return
    }
    if (this.isBookmarked) {
      this.challengeService.removeBookmark(this.idChallenge).subscribe({
        next: response => {
          this.isBookmarked = response.bookmarked
        },
        error: error => {
          console.error('Error removing bookmark:', error)
        }
      })
    } else {
      this.challengeService.addBookmark(this.idChallenge).subscribe({
        next: response => {
          this.isBookmarked = response.bookmarked
        },
        error: error => {
          console.error('Error adding bookmark:', error)
        }
      })
    }
  }
    onCancel (): void {
    void this.router.navigate(['/ita-challenge/challenges'])
  }

  onContinueChallenge(): void {
  this.challengeStarted = true;
  this.isEditorChallengeVisible = true;
  this.status = SolutionStatus.IN_PROGRESS;
  this.startChallenge.emit(true);
  this.loadSolutionFromBackend();
}
loadSolutionFromBackend(): void {
  this.solutionService.fetchUserSolution().subscribe({
    next: (solutions) => {
      const matchingSolution = solutions.find(sol =>
        sol.uuid_challenge === this.idChallenge &&
        sol.uuid_language === this.languageId
      );

      if (matchingSolution) {
        this.currentSolutionText = matchingSolution.solution_text || '';
      }
    },
    error: (err) => {
      console.error('Error loading saved solutions:', err);
    }
  });
}
}
