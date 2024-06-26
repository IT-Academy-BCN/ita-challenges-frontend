import {
  type AfterContentChecked,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
  type SimpleChanges,
  type OnChanges,
  type OnInit
} from '@angular/core'
import { type ChallengeDetails } from 'src/app/models/challenge-details.model'
import { type Example } from 'src/app/models/challenge-example.model'
import { type Language } from 'src/app/models/language.model'
import { ChallengeService } from '../../../../services/challenge.service'
import { type Subscription } from 'rxjs'
import { DataChallenge } from '../../../../models/data-challenge.model'
import { type Challenge } from '../../../../models/challenge.model'
import { NgbModal, type NgbNav } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/services/auth.service'
import { SolutionService } from 'src/app/services/solution.service'
import { SendSolutionModalComponent } from 'src/app/modules/modals/send-solution-modal/send-solution-modal.component'
import { RestrictedModalComponent } from 'src/app/modules/modals/restricted-modal/restricted-modal.component'
import { RelatedService } from '../../../../services/related.service'
import { type SolutionResults } from 'src/app/models/solution-results.model'
import { Router } from '@angular/router'

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss'],
  providers: [ChallengeService]
})
export class ChallengeInfoComponent implements OnInit, AfterContentChecked, OnChanges {
  showStatement = true
  isLogged: boolean = false
  solutionSent: boolean = false
  isUserSolution: boolean = true
  resources: string = ''
  params$!: Subscription
  relatedChallengesData!: DataChallenge
  relatedListOfChallenges: Challenge[] = []
  challengeSubs$!: Subscription
  challengeSolutions: SolutionResults[] = []
  idLanguage: string = ''
  userId: string | undefined = ''
  loadSolutionsCard: boolean = false
  private activeIdSubscription: Subscription | undefined

  private readonly authService = inject(AuthService)
  private readonly solutionService = inject(SolutionService)
  private readonly modalService = inject(NgbModal)
  private readonly relatedService = inject(RelatedService)
  private readonly router = inject(Router)
  // private readonly changeDetectorRef = inject(ChangeDetectorRef)

  @ViewChild('nav') nav!: NgbNav

  @Input() detail!: ChallengeDetails
  @Input() description!: string
  @Input() examples: Example[] = []
  @Input() notes!: string
  @Input() popularity!: number
  @Input() languages: Language[] = []
  @Input() activeId: number = 1
  @Input() idChallenge: string = ''

  @Output() activeIdChange: EventEmitter<number> = new EventEmitter<number>()

  ngOnChanges (changes: SimpleChanges): void {
    console.log('ngOnChanges')

    this.userId = this.authService.getUserIdFromCookie()

    if (changes['languages']?.currentValue?.length > 0 && this.idLanguage !== '') {
      this.idLanguage = this.languages[0].id_language
      this.loadSolutions(this.idChallenge, this.idLanguage)
      this.solutionService.isUserSolutionSent(this.userId, this.idChallenge, this.idLanguage).subscribe((data) => {
        if (data.results.length > 0) {
          this.solutionSent = !this.solutionSent
          this.isUserSolution = !this.isUserSolution
        }
      })
    }
  }

  async ngOnInit (): Promise<void> {
    console.log('ngOnInit')

    this.solutionService.solutionSent$.subscribe((value) => {
      this.isUserSolution = !value
      this.solutionSent = value
    })
    this.isLogged = this.authService.isUserLoggedIn()
    this.loadRelatedChallenges(this.idChallenge)
  }

  ngAfterContentChecked (): void {
    console.log('ngAfterContentChecked')

    const token = localStorage.getItem('authToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (
      token !== null &&
      refreshToken !== null &&
      token !== '' &&
      refreshToken !== ''
    ) {
      this.isLogged = true
    }

    if (this.activeIdSubscription === undefined) {
      this.activeIdSubscription = this.solutionService.activeId$.subscribe((value) => {
        this.activeId = value
        console.log('ActiveId updated from service:', this.activeId)
        // this.changeDetectorRef.detectChanges()
      })
    }
  }

  loadRelatedChallenges (id: string): void {
    console.log('loadRelatedChallenges')

    this.challengeSubs$ = this.relatedService
      .getRelatedChallenges(id)
      .subscribe((data) => {
        this.relatedChallengesData = new DataChallenge(data)
        this.relatedListOfChallenges = this.relatedChallengesData.challenges
      })
  }

  onActiveIdChange (newActiveId: number): void {
    console.log('Nuevo valor de activeId:', newActiveId) // Imprime el valor de entrada
    if (this.activeIdChange !== null) {
      this.activeId = newActiveId
      console.log('Valor actualizado de this.activeId:', this.activeId) // Imprime el valor después de actualizarlo
      this.activeIdChange.emit(this.activeId)
    }
  }

  openSendSolutionModal (): void {
    console.log('openSendSolutionModal')

    this.modalService.open(SendSolutionModalComponent, {
      centered: true,
      size: 'lg'
    })
  }

  clickSendButton (): void {
    console.log('clickSendButton')

    if (!this.isLogged) {
      this.modalService.open(RestrictedModalComponent, {
        centered: true,
        size: 'lg'
      })
    } else {
      this.solutionService.sendSolution('') // Puedes pasar la solución como argumento si es necesario
    }
  }

  loadSolutions (idChallenge: string, idLanguage: string): void {
    console.log('loadSolutions')

    this.solutionService.getAllChallengeSolutions(idChallenge, idLanguage).subscribe((data) => {
      this.challengeSolutions = data.results

      // Verificar si activeId ya está configurado correctamente
      if (this.activeId !== 1) {
        // Establecer activeId en 1 para activar la pestaña de detalles
        this.activeId = 1
        console.log('ActiveId set to:', this.activeId)

        // Emitir el cambio de activeId
        this.activeIdChange.emit(this.activeId)
        console.log('ActiveId emitted:', this.activeId)

        // Forzar la detección de cambios
        // this.changeDetectorRef.detectChanges()
        console.log('Changes detected')

        // Asegurarse de que la pestaña de detalles se active
        this.onActiveIdChange(this.activeId)
      }
    })
  }
}
