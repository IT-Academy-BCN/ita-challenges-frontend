import { Component, Input, type OnInit, EventEmitter, Output, inject } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component'
import { TranslateService } from '@ngx-translate/core'
import { ChallengeService } from '../../../../services/challenge.service'
import { SolutionService } from 'src/app/services/solution.service'
import { AuthService } from 'src/app/services/auth.service'
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'

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

  @Input() title = ''
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() activeId!: ChallengeTab
  @Input() idChallenge!: string
  @Input() isEditorChallengeVisible: boolean = false
  @Input() favorites_count: number = 0

  @Output() startChallenge = new EventEmitter<boolean>()
  @Output() favoritesUpdated = new EventEmitter<number>()

  challenge_title: string | undefined = ''
  challenge_date: Date | undefined
  challenge_level: string | undefined

  challengeStarted: boolean = false
  solutionSent: boolean = false
  isFavorite: boolean = false

  ngOnInit (): void {
    this.challenge_title = this.title
    this.challenge_date = this.creation_date
    this.challenge_level = this.level

    this.route.params.subscribe(params => {
      this.idChallenge = params['idChallenge']
    })

    const savedSolutions = JSON.parse(localStorage.getItem('solutions') ?? '[]') as string[]
    this.solutionSent = savedSolutions.includes(this.idChallenge)

    this.checkFavoriteStatus()

    this.solutionService.challengeCompleted$.subscribe({
      next: (challengeId: string) => {
        if (challengeId === this.idChallenge) {
          this.challengeStarted = false;
          this.activeId = ChallengeTab.SOLUTIONS; 
        }
      },
      error: (error) => {
        console.error('Error in challengeCompleted$ subscription:', error);
      }
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

    console.log(localStorage.getItem('challengeStarted'))

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
    console.log(localStorage.getItem('challengeStarted'))

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
  }

  onSolutionAccepted(): void {
    this.solutionSent = true; 
    this.activeId = 2; 
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
    this.isFavorite = !this.isFavorite
    this.favorites_count += this.isFavorite ? 1 : -1
    if (this.isFavorite) {
      this.removeFromFavorites()
    } else {
      this.addToFavorites()
    }
  }

  private addToFavorites(): void {
    this.challengeService.addToFavorites(this.idChallenge).subscribe(response => {
      this.isFavorite = response.isFavorite
      this.favorites_count = response.timesFavorited
      this.favoritesUpdated.emit(this.favorites_count)
    })
  }

  private removeFromFavorites(): void {
    this.challengeService.removeFromFavorites(this.idChallenge).subscribe(response => {
      this.isFavorite = response.isFavorite
      this.favorites_count = response.timesFavorited
      this.favoritesUpdated.emit(this.favorites_count)
    })
  }

  private checkFavoriteStatus(): void {
    const isFavorited = localStorage.getItem(`is_favorite_${this.idChallenge}`);
    this.isFavorite = isFavorited === 'true';
    
    const storedCount = localStorage.getItem(`favorites_count_${this.idChallenge}`);
    if (storedCount) {
      this.favorites_count = parseInt(storedCount, 10);
      this.favoritesUpdated.emit(this.favorites_count);
    }
  }
}
