import { ChangeDetectorRef, Component, Input, type OnInit, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component'
import { RestrictedModalComponent } from './../../../modals/restricted-modal/restricted-modal.component'
import { SolutionService } from '../../../../services/solution.service'
import { AuthService } from 'src/app/services/auth.service'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-challenge-header',
  templateUrl: './challenge-header.component.html',
  styleUrls: ['./challenge-header.component.scss']
})
export class ChallengeHeaderComponent implements OnInit {
  private readonly modalService = inject(NgbModal)
  private readonly solutionService = inject(SolutionService)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly translate = inject(TranslateService)
  private readonly userService = inject(UserService)
  private readonly cdr = inject(ChangeDetectorRef)

  @Input() title = ''
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() activeId!: number
  @Input() idChallenge!: string

  challenge_title: string | undefined = ''
  challenge_date: Date | undefined
  challenge_level: string | undefined

  isLogged: boolean = false
  solutionSent: boolean = false

  async ngOnInit (): Promise<void> {
    // this.userService.monitorSolutionState() // devo toglierlo dopo
    this.challenge_title = this.title
    this.challenge_date = this.creation_date
    this.challenge_level = this.level

    this.userService.userLoggedIn$.subscribe((loggedIn) => {
      this.isLogged = loggedIn
      // Forza il rilevamento delle modifiche se necessario
      this.cdr.detectChanges()
    })
    this.userService.userSolutions$.subscribe((solutions) => {
      this.solutionSent = solutions.includes(this.idChallenge)
    })

    // this.solutionSent = this.solutionService.isSolutionSent(this.idChallenge)
    // console.log(`Solution sent for challenge ${this.idChallenge}:`, this.solutionSent)
  }

  openSendSolutionModal (): void {
    const modalRef = this.modalService.open(SendSolutionModalComponent, {
      centered: true,
      size: 'lg'
    })
    modalRef.componentInstance.idChallenge = this.idChallenge
  }

  clickSendButton (): void {
    if (!this.isLogged) {
      this.modalService.open(RestrictedModalComponent, {
        centered: true,
        size: 'lg'
      })
    } else {
      this.openSendSolutionModal()
    }
  }

  get currentLang (): string {
    return this.translate.currentLang
  }
}
