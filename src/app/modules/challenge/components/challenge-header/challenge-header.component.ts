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

  private readonly challengeService = inject(ChallengeService)
  private readonly solutionService = inject(SolutionService)
  private readonly authService = inject(AuthService);
  public userId: string | null = null;
  public userRole: string | null = null;

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
  @Input() languageId!: string
  @Input() timesSolved: number = 0
  @Output() startChallenge = new EventEmitter<boolean>()
  @Output() favoritesUpdated = new EventEmitter<number>()

  challenge_title: string | undefined = ''
  challenge_date: Date | undefined
  challenge_level: string | undefined

  challengeStarted: boolean = false
  solutionSent: boolean = false

  ngOnInit (): void {
    this.challenge_title = this.title
    this.challenge_date = this.creation_date
    this.challenge_level = this.level

    this.route.params.subscribe(params => {
      this.idChallenge = params['idChallenge']
    })

    this.solutionService.fetchUserSolution().subscribe({
      next: (userSolutions) => {
        const hasSolution = userSolutions.some(
          (sol) =>
            sol.uuid_challenge === this.idChallenge &&
            sol.solution_text?.trim() !== ''
        );
        this.solutionSent = hasSolution;
      },
      error: (err) => {
        console.error('Error fetching user solutions:', err);
      },
    });

    this.authService.getUserId().subscribe(userId => {
      this.userId = userId;

      if (!userId) {
        console.error("Could not get User ID");
      } 
    }); 

    this.authService.getUserRole().subscribe(role => {
      this.userRole = role
    })

    // Verifica si el reto ya ha comenzado
    if (this.challengeStarted) {
      this.activeId = ChallengeTab.SOLUTIONS
    }

    // Recuperar el estado del reto desde localStorage
    const savedChallenge = JSON.parse(localStorage.getItem('challengeStarted') ?? '{}') as { id?: string, started?: boolean }

    if (savedChallenge.id === this.idChallenge && savedChallenge?.started === true) {
      this.challengeStarted = true
      this.activeId = ChallengeTab.SOLUTIONS // Mostrar botones de guardar y enviar solución
    }
  }

  async onStartChallenge (): Promise<void> {
    this.challengeStarted = true
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

  saveChallenge (): void {
    console.log('Guardando reto...')
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
}
