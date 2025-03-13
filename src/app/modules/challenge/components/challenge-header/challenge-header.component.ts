import { Component, Input, type OnInit, EventEmitter, Output, inject } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component'
import { TranslateService } from '@ngx-translate/core'
import { ChallengeService } from '../../../../services/challenge.service'

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

  @Input() title = ''
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() activeId!: number
  @Input() idChallenge!: string
  @Input() showEditor: boolean = false
  @Input() saved_count: number = 0
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

    // Check if challenge is favorited
    this.checkFavoriteStatus()

    // Verifica si el reto ya ha comenzado
    if (this.challengeStarted) {
      this.activeId = 2
    }

    // Recuperar el estado del reto desde localStorage
    const savedChallenge = JSON.parse(localStorage.getItem('challengeStarted') ?? '{}') as { id?: string, started?: boolean }

    console.log(localStorage.getItem('challengeStarted'))

    if (savedChallenge.id === this.idChallenge && savedChallenge?.started === true) {
      this.challengeStarted = true
      this.activeId = 2 // Mostrar botones de guardar y enviar solución
    }
  }

  async onStartChallenge (): Promise<void> {
    this.challengeStarted = true
    this.activeId = 2
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
      size: 'lg'
    })
    modalRef.componentInstance.idChallenge = this.idChallenge
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

  // Method to toggle favorites
  toggleFavorite(): void {
    if (this.isFavorite) {
      this.removeFromFavorites()
    } else {
      this.addToFavorites()
    }
  }

  // Method to add to favorites
  private addToFavorites(): void {
    this.challengeService.addToFavorites(this.idChallenge).subscribe(response => {
      this.isFavorite = response.isFavorite
      this.favorites_count = response.timesFavorited
      this.favoritesUpdated.emit(this.favorites_count)
      console.log('Added to favorites:', response)
    })
  }

  // Method to remove from favorites
  private removeFromFavorites(): void {
    this.challengeService.removeFromFavorites(this.idChallenge).subscribe(response => {
      this.isFavorite = response.isFavorite
      this.favorites_count = response.timesFavorited
      this.favoritesUpdated.emit(this.favorites_count)
      console.log('Removed from favorites:', response)
    })
  }

  // Check if the challenge is in favorites
  private checkFavoriteStatus(): void {
    // For mock purposes, we'll check localStorage
    const isFavorited = localStorage.getItem(`is_favorite_${this.idChallenge}`);
    this.isFavorite = isFavorited === 'true';
    
    // Also update the favorites count from localStorage if available
    const storedCount = localStorage.getItem(`favorites_count_${this.idChallenge}`);
    if (storedCount) {
      this.favorites_count = parseInt(storedCount, 10);
      // Emit the updated count
      this.favoritesUpdated.emit(this.favorites_count);
    }
  }
}
