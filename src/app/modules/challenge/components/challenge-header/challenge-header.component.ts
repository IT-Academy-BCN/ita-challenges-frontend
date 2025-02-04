import { ChangeDetectorRef, Component, Input, type OnInit, inject, EventEmitter, Output } from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from 'src/app/services/user.service'
@Component({
  selector: 'app-challenge-header',
  templateUrl: './challenge-header.component.html',
  styleUrls: ['./challenge-header.component.scss']
})
export class ChallengeHeaderComponent implements OnInit {
  constructor (private readonly router: Router) {}

  private readonly modalService = inject(NgbModal)
  private readonly translate = inject(TranslateService)
  private readonly userService = inject(UserService)
  private readonly cdr = inject(ChangeDetectorRef)

  @Input() title = ''
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() activeId!: number
  @Input() idChallenge!: string

  @Output() startChallengeEvent = new EventEmitter<boolean>()

  challenge_title: string | undefined = ''
  challenge_date: Date | undefined
  challenge_level: string | undefined

  solutionSent: boolean = false

  ngOnInit (): void {
    // this.userService.monitorSolutionState() // devo toglierlo dopo
    this.challenge_title = this.title
    this.challenge_date = this.creation_date
    this.challenge_level = this.level

    const savedSolutions = JSON.parse(localStorage.getItem('solutions') ?? '[]') as string[]
    const solutions = this.userService.userSolutions
    this.solutionSent = savedSolutions.includes(this.idChallenge) || solutions.includes(this.idChallenge)
  }

  onStartChallenge (started: boolean): void {
    console.log('startChallenge event emitted:', started)
    this.startChallengeEvent.emit(started)
  }

  openSendSolutionModal (): void {
    const modalRef = this.modalService.open(SendSolutionModalComponent, {
      centered: true,
      size: 'lg'
    })
    modalRef.componentInstance.idChallenge = this.idChallenge
  }

  // clickSendButton (): void {
  //   this.openSendSolutionModal()
  // }

  get currentLang (): string {
    return this.translate.currentLang
  }
}
