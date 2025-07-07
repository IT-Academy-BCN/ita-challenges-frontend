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
  private readonly challengeService = inject(ChallengeService)
  private readonly solutionService = inject(SolutionService)
  private readonly authService = inject(AuthService);
  public userId: string | null = null;
  public userRole: string | null = null;
  public currentSolutionText: string = '';
<<<<<<< HEAD
  
=======
>>>>>>> d350ee4e (fix: show/hide challenge action buttons based on user role and state)

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
<<<<<<< HEAD
  @Input() solutionState: SolutionStatus = SolutionStatus.NOT_STARTED;
=======
<<<<<<< HEAD
  @Input() solutionState: SolutionState = 'NOT_STARTED';
=======
  @Input() solutionState: 'NOT_STARTED' | 'IN_PROGRESS' | 'ENDED' = 'NOT_STARTED';
>>>>>>> d350ee4e (fix: show/hide challenge action buttons based on user role and state)
>>>>>>> 568266be (fix: show/hide challenge action buttons based on user role and state)
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
<<<<<<< HEAD
    if (!userId) {
      console.error("Could not get User ID");
      return;
    }
    this.userId = userId;
    this.loadUserSolutionStatus();
    
=======
    this.userId = userId;

    if (!userId) {
      console.error(" No se pudo obtener el ID del usuario");
    } else {
      this.loadUserSolutionStatus();
    }
>>>>>>> d350ee4e (fix: show/hide challenge action buttons based on user role and state)
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
<<<<<<< HEAD
          sol.uuid_challenge === this.idChallenge
      );

      if (!solution) {
        this.solutionState = SolutionStatus.NOT_STARTED;
        this.challengeStarted = false;
        return;
      }
      this.status = solution.status;
      this.solutionText = solution.solution_text;

        switch (solution.status) {
        case SolutionStatus.IN_PROGRESS:
          this.solutionState = SolutionStatus.IN_PROGRESS;
          this.challengeStarted = false;
          break;

        case SolutionStatus.ENDED:
          this.solutionState = SolutionStatus.ENDED;
          this.solutionSent = true;
          this.challengeStarted = true;
          this.activeId = ChallengeTab.SOLUTIONS;
          break;

        default:
          console.warn(`Unhandled solution status: ${solution.status}`);
          this.solutionState = SolutionStatus.NOT_STARTED;
          this.challengeStarted = false;
          break;
      }
    },
    error: (err) => {
      console.error('Error fetching user solutions:', err);
=======
          sol.uuid_challenge === this.idChallenge &&
          sol.solution_text?.trim() !== ''
      );

      if (solution) {
        this.status = solution.status;

        if (solution.status === 'IN_PROGRESS') {
          this.solutionState = 'IN_PROGRESS';
          this.savedSolutionText = solution.solution_text;
          this.challengeStarted = false; 
        } else if (solution.status === 'ENDED') {
          this.solutionState = 'ENDED';
          this.solutionSent = true;
          this.challengeStarted = true;
          this.activeId = ChallengeTab.SOLUTIONS;
        }
      } else {
        this.solutionState = 'NOT_STARTED';
        this.challengeStarted = false;
      }
    },
    error: (err) => {
      console.error(' Error al cargar soluciones del usuario:', err);
>>>>>>> d350ee4e (fix: show/hide challenge action buttons based on user role and state)
    }
  });
}


  async onStartChallenge (): Promise<void> {
    this.challengeStarted = true
    this.solutionState = SolutionStatus.IN_PROGRESS;
    this.activeId = ChallengeTab.SOLUTIONS
    this.startChallenge.emit(true)
  }

  openSendSolutionModal (): void {
    const modalRef = this.modalService.open(SendSolutionModalComponent, {
      centered: true,
      size: 'md'
    })
    modalRef.componentInstance.idChallenge = this.idChallenge;
    modalRef.componentInstance.userId = this.userId;
<<<<<<< HEAD
    modalRef.componentInstance.status = this.SolutionStatus.ENDED;
=======
    modalRef.componentInstance.status = 'ENDED';
>>>>>>> d350ee4e (fix: show/hide challenge action buttons based on user role and state)
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
<<<<<<< HEAD
    console.error(' Missing data to save the solution');
    return;
  }

  this.status = SolutionStatus.IN_PROGRESS;
=======
    console.error(' Faltan datos para guardar la solución');
    return;
  }

  this.status = 'IN_PROGRESS';
>>>>>>> d350ee4e (fix: show/hide challenge action buttons based on user role and state)
  this.solutionService.submitSolution(
    this.idChallenge,
    this.languageId,
    this.userId,
    this.status,
    this.solutionText
  ).subscribe({
    next: () => {
<<<<<<< HEAD
      this.solutionState = SolutionStatus.IN_PROGRESS;
    },
    error: (err) => {
      console.error(' Error saving solution', err);
=======
      this.solutionState = 'IN_PROGRESS';
    },
    error: (err) => {
      console.error(' Error al guardar solución', err);
>>>>>>> d350ee4e (fix: show/hide challenge action buttons based on user role and state)
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
<<<<<<< HEAD
    onCancel (): void {
    void this.router.navigate(['/ita-challenge/challenges'])
  }

  onContinueChallenge(): void {
  this.challengeStarted = true;
  this.isEditorChallengeVisible = true;
<<<<<<< HEAD
  this.solutionState = SolutionStatus.IN_PROGRESS;
=======
  this.status = SolutionStatus.IN_PROGRESS;
=======
  onContinueChallenge(): void {
  this.challengeStarted = true;
  this.isEditorChallengeVisible = true;
  this.status = 'IN_PROGRESS';
>>>>>>> d350ee4e (fix: show/hide challenge action buttons based on user role and state)
>>>>>>> 568266be (fix: show/hide challenge action buttons based on user role and state)
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
<<<<<<< HEAD
=======





>>>>>>> d350ee4e (fix: show/hide challenge action buttons based on user role and state)
}
