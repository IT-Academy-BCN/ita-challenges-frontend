import { Component, Input, type OnInit, EventEmitter, Output } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component'
import { TranslateService } from '@ngx-translate/core'

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

  @Input() title = ''
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() activeId!: number
  @Input() idChallenge!: string

  @Output() startChallenge = new EventEmitter<boolean>()

  challenge_title: string | undefined = ''
  challenge_date: Date | undefined
  challenge_level: string | undefined

  challengeStarted: boolean = false
  solutionSent: boolean = false

  ngOnInit (): void {
    this.challenge_title = this.title
    this.challenge_date = this.creation_date
    this.challenge_level = this.level

    // Obtener el idChallenge desde la ruta activa
    this.route.params.subscribe(params => {
      this.idChallenge = params['idChallenge']
    })

    const savedSolutions = JSON.parse(localStorage.getItem('solutions') ?? '[]') as string[]
    this.solutionSent = savedSolutions.includes(this.idChallenge)

    // Verifica si el reto ya ha comenzado
    if (this.challengeStarted) {
      this.activeId = 2 // Cambia el activeId a 2 para mostrar los botones de guardar y enviar solución
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
    this.activeId = 2 // Cambia el valor de activeId a 2, lo que hará desaparecer el primer botón

    // Guardar el estado en localStorage
    localStorage.setItem('challengeStarted', JSON.stringify({ id: this.idChallenge, started: true }))

    // Emitir el evento para notificar al componente padre
    this.startChallenge.emit(true)
    console.log(localStorage.getItem('challengeStarted'))

    try {
      // await this.router.navigate([`/ita-challenge/challenges/${this.idChallenge}/start`])
      await this.router.navigate(['/ita-challenge/challenges/start'])
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
}
